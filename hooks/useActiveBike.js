"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Bike, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ActiveBikeContext = createContext(null);

const initialBikeForm = {
  name: "",
  make: "",
  model: "",
  year: "",
  plateNumber: "",
  purchaseKm: "",
  color: "",
  imageUrl: "",
  oilChangeInterval: "2000",
};

function buildBikePayload(formData) {
  return {
    name: formData.name?.trim() || "My Bike",
    make: formData.make?.trim() || "",
    model: formData.model?.trim() || "",
    year: formData.year ? Number(formData.year) : null,
    plateNumber: formData.plateNumber?.trim() || "",
    purchaseKm: Number(formData.purchaseKm || 0),
    color: formData.color?.trim() || "",
    imageUrl: formData.imageUrl?.trim() || "",
    oilChangeInterval: Number(formData.oilChangeInterval || 2000),
  };
}

async function assignLegacyDocsToBike({ uid, bikeId }) {
  const targets = [
    { name: "rides", ref: collection(db, "rides") },
    { name: "expenses", ref: collection(db, "expenses") },
    { name: "services", ref: collection(db, "services") },
    { name: "checklists", ref: collection(db, "checklists") },
    { name: "odometer_readings", ref: collection(db, "odometer_readings") },
    { name: "fuelLogs", ref: collection(db, "users", uid, "fuelLogs") },
  ];

  let updated = 0;

  // Firestore batches are limited to 500 writes.
  const commitUpdates = async (updates) => {
    if (!updates.length) return;
    let batch = writeBatch(db);
    let inBatch = 0;

    for (const { ref, data } of updates) {
      batch.update(ref, data);
      inBatch += 1;
      updated += 1;
      if (inBatch >= 450) {
        await batch.commit();
        batch = writeBatch(db);
        inBatch = 0;
      }
    }

    if (inBatch > 0) await batch.commit();
  };

  for (const t of targets) {
    const snap = await getDocs(t.ref);
    const updates = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data() || {};
      if (d.userId !== uid) return;
      if (d.bikeId) return;
      updates.push({
        ref: docSnap.ref,
        data: { bikeId },
      });
    });
    await commitUpdates(updates);
  }

  return updated;
}

async function migrateLegacyUserBikeFields({ uid, bikeId }) {
  const userRef = doc(db, "users", uid);
  const bikeRef = doc(db, "users", uid, "bikes", bikeId);
  const [userSnap, bikeSnap] = await Promise.all([getDoc(userRef), getDoc(bikeRef)]);
  const u = userSnap.exists() ? userSnap.data() : {};
  const b = bikeSnap.exists() ? bikeSnap.data() : {};

  const patch = {};

  // Old single-bike fields on /users/{uid}
  if (b.oilChangeInterval == null && u.oilChangeLimit != null) patch.oilChangeInterval = Number(u.oilChangeLimit);
  if (b.lastResetKm == null && u.lastResetKm != null) patch.lastResetKm = Number(u.lastResetKm);
  if (b.lastOdometerReading == null && u.lastOdometerReading != null) patch.lastOdometerReading = Number(u.lastOdometerReading);
  if (b.hasInitialOdometer == null && u.hasInitialOdometer != null) patch.hasInitialOdometer = Boolean(u.hasInitialOdometer);
  if (b.lastOilChangeDate == null && u.lastOilChangeDate) patch.lastOilChangeDate = u.lastOilChangeDate;
  if ((!b.name || b.name === "My Bike") && u.bikeName) patch.name = String(u.bikeName);

  if (Object.keys(patch).length) {
    await setDoc(bikeRef, patch, { merge: true });
  }
}

export function ActiveBikeProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [bikes, setBikes] = useState([]);
  const [activeBikeId, setActiveBikeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [savingOnboarding, setSavingOnboarding] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState(initialBikeForm);
  const [legacyMigrating, setLegacyMigrating] = useState(false);

  const storageKey = user ? `bikecare_active_bike_${user.uid}` : null;
  const legacyMigrationKey = user ? `bikecare_legacy_migrated_${user.uid}` : null;

  const fetchBikes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [bikeSnap, userSnap] = await Promise.all([
        getDocs(collection(db, "users", user.uid, "bikes")),
        getDoc(doc(db, "users", user.uid)),
      ]);

      const fetchedBikes = bikeSnap.docs.map((bikeDoc) => ({ id: bikeDoc.id, ...bikeDoc.data() }));
      setBikes(fetchedBikes);

      if (!fetchedBikes.length) {
        setActiveBikeId(null);
        setOnboardingOpen(true);
        return;
      }

      const storedBikeId =
        typeof window !== "undefined" && storageKey ? window.localStorage.getItem(storageKey) : null;
      const defaultBikeId = userSnap.exists() ? userSnap.data().defaultBikeId : null;

      const candidateId = storedBikeId || defaultBikeId || fetchedBikes[0].id;
      const validId = fetchedBikes.some((bike) => bike.id === candidateId)
        ? candidateId
        : fetchedBikes[0].id;

      setActiveBikeId(validId);
      if (typeof window !== "undefined" && storageKey) {
        window.localStorage.setItem(storageKey, validId);
      }
      setOnboardingOpen(false);

      // ✅ Auto-restore legacy (pre-multi-bike) logs once per user
      if (typeof window !== "undefined" && legacyMigrationKey) {
        const alreadyMigrated = window.localStorage.getItem(legacyMigrationKey) === "1";
        if (!alreadyMigrated) {
          setLegacyMigrating(true);
          // Fire-and-forget; don't block page render
          assignLegacyDocsToBike({ uid: user.uid, bikeId: validId })
            .then(async (updated) => {
              await migrateLegacyUserBikeFields({ uid: user.uid, bikeId: validId });
              window.localStorage.setItem(legacyMigrationKey, "1");
              if (updated > 0) toast.success(`Restored ${updated} old logs to "${fetchedBikes.find(b => b.id === validId)?.name || "your bike"}".`);
            })
            .catch((err) => {
              console.error("Legacy restore failed:", err);
              toast.error("Could not restore old data automatically.");
            })
            .finally(() => setLegacyMigrating(false));
        }
      }
    } catch (error) {
      console.error("Error loading bikes:", error);
      toast.error("Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  }, [user, storageKey, legacyMigrationKey]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setBikes([]);
      setActiveBikeId(null);
      setLoading(false);
      setOnboardingOpen(false);
      return;
    }
    fetchBikes();
  }, [user, authLoading, fetchBikes]);

  const selectBike = useCallback(
    async (bikeId, persistDefault = false) => {
      if (!user || !bikeId) return;
      setActiveBikeId(bikeId);
      if (typeof window !== "undefined" && storageKey) {
        window.localStorage.setItem(storageKey, bikeId);
      }
      if (persistDefault) {
        await setDoc(doc(db, "users", user.uid), { defaultBikeId: bikeId }, { merge: true });
      }
    },
    [user, storageKey]
  );

  const restoreLegacyDataToBike = useCallback(
    async (bikeId) => {
      if (!user || !bikeId) return;
      setLegacyMigrating(true);
      try {
        const updated = await assignLegacyDocsToBike({ uid: user.uid, bikeId });
        await migrateLegacyUserBikeFields({ uid: user.uid, bikeId });
        if (typeof window !== "undefined" && legacyMigrationKey) {
          window.localStorage.setItem(legacyMigrationKey, "1");
        }
        toast.success(updated > 0 ? `Restored ${updated} old logs.` : "No old logs found to restore.");
      } catch (err) {
        console.error("Manual legacy restore failed:", err);
        toast.error("Failed to restore old data.");
      } finally {
        setLegacyMigrating(false);
      }
    },
    [user, legacyMigrationKey]
  );

  const addBike = useCallback(
    async (formData) => {
      if (!user) return null;
      const isFirstBike = bikes.length === 0;
      const payload = buildBikePayload(formData);
      const bikeDoc = await addDoc(collection(db, "users", user.uid, "bikes"), {
        ...payload,
        lastResetKm: 0,
        lastOilChangeDate: null,
        lastOdometerReading: payload.purchaseKm || 0,
        hasInitialOdometer: (payload.purchaseKm || 0) > 0,
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const hasDefault = userSnap.exists() && userSnap.data().defaultBikeId;
      if (!hasDefault) {
        await setDoc(userRef, { defaultBikeId: bikeDoc.id }, { merge: true });
      }

      // ✅ Migration: if this is the first bike ever created, attach old (pre-multi-bike) logs to it
      if (isFirstBike) {
        try {
          const updated = await assignLegacyDocsToBike({ uid: user.uid, bikeId: bikeDoc.id });
          await migrateLegacyUserBikeFields({ uid: user.uid, bikeId: bikeDoc.id });
          if (updated > 0) toast.success(`Restored ${updated} old logs into your first bike.`);
        } catch (err) {
          console.error("Legacy migration failed:", err);
          toast.error("Bike created, but restoring old data failed.");
        }
      }

      await fetchBikes();
      return bikeDoc.id;
    },
    [user, bikes.length, fetchBikes]
  );

  const updateBikeDetails = useCallback(
    async (bikeId, formData) => {
      if (!user || !bikeId) return;
      const payload = buildBikePayload(formData);
      await updateDoc(doc(db, "users", user.uid, "bikes", bikeId), payload);
      await fetchBikes();
    },
    [user, fetchBikes]
  );

  const deleteBikeById = useCallback(
    async (bikeId) => {
      if (!user || !bikeId) return;
      await deleteDoc(doc(db, "users", user.uid, "bikes", bikeId));
      await fetchBikes();
    },
    [user, fetchBikes]
  );

  const handleCreateFirstBike = async (e) => {
    e.preventDefault();
    if (!onboardingForm.name.trim()) {
      toast.error("Bike name is required.");
      return;
    }
    setSavingOnboarding(true);
    try {
      const firstBikeId = await addBike(onboardingForm);
      if (firstBikeId) {
        await selectBike(firstBikeId, true);
      }
      setOnboardingForm(initialBikeForm);
      setOnboardingOpen(false);
      toast.success("Bike created. You are ready to ride!");
    } catch (error) {
      console.error("Error creating first bike:", error);
      toast.error("Failed to create bike.");
    } finally {
      setSavingOnboarding(false);
    }
  };

  const activeBike = useMemo(
    () => bikes.find((bike) => bike.id === activeBikeId) || null,
    [bikes, activeBikeId]
  );

  return (
    <ActiveBikeContext.Provider
      value={{
        bikes,
        activeBike,
        activeBikeId,
        loading,
        legacyMigrating,
        selectBike,
        refreshBikes: fetchBikes,
        restoreLegacyDataToBike,
        addBike,
        updateBikeDetails,
        deleteBikeById,
      }}
    >
      {children}
      {user && onboardingOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreateFirstBike}
            className="w-full max-w-xl glass rounded-2xl border border-white/10 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center">
                <Bike size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Add your first bike</h2>
                <p className="text-sm text-slate-400">BikeCare now supports multiple bikes.</p>
              </div>
            </div>
            <input
              className="glass-input"
              placeholder="Bike name"
              value={onboardingForm.name}
              onChange={(e) => setOnboardingForm({ ...onboardingForm, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="glass-input"
                placeholder="Make"
                value={onboardingForm.make}
                onChange={(e) => setOnboardingForm({ ...onboardingForm, make: e.target.value })}
              />
              <input
                className="glass-input"
                placeholder="Model"
                value={onboardingForm.model}
                onChange={(e) => setOnboardingForm({ ...onboardingForm, model: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="glass-input"
                type="number"
                placeholder="Purchase KM"
                value={onboardingForm.purchaseKm}
                onChange={(e) => setOnboardingForm({ ...onboardingForm, purchaseKm: e.target.value })}
              />
              <input
                className="glass-input"
                type="number"
                placeholder="Oil interval (km)"
                value={onboardingForm.oilChangeInterval}
                onChange={(e) =>
                  setOnboardingForm({ ...onboardingForm, oilChangeInterval: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={savingOnboarding}
              className="w-full btn-glow py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {savingOnboarding ? <Loader2 size={18} className="animate-spin" /> : null}
              {savingOnboarding ? "Creating..." : "Create Bike"}
            </button>
          </motion.form>
        </div>
      )}
    </ActiveBikeContext.Provider>
  );
}

export function useActiveBike() {
  return useContext(ActiveBikeContext);
}
