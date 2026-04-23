"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useActiveBike } from "@/hooks/useActiveBike";
import Navbar from "@/components/Navbar";
import { Settings, Save, Loader2, Smartphone, Bell, Bike, Navigation } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { bikes, activeBikeId, selectBike } = useActiveBike();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    mechanicPhone: "",
    autoMessageEnabled: true,
    preferredMethod: "wa",
    fuelEfficiencyThreshold: 35,
  });
  const [bikeForm, setBikeForm] = useState({
    name: "My Bike",
    oilChangeInterval: 2000,
    lastOilChangeDate: "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const loadSettings = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          setFormData({
            mechanicPhone: d.mechanicPhone || "",
            autoMessageEnabled: d.autoMessageEnabled ?? true,
            preferredMethod: d.preferredMethod || "wa",
            fuelEfficiencyThreshold: d.fuelEfficiencyThreshold ?? 35,
          });
        }
      } catch(err) {
         console.error(err);
         toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [user]);

  useEffect(() => {
    if (!user || !activeBikeId) return;
    const loadBike = async () => {
      try {
        const bikeRef = doc(db, "users", user.uid, "bikes", activeBikeId);
        const bikeSnap = await getDoc(bikeRef);
        if (bikeSnap.exists()) {
          const b = bikeSnap.data();
          setBikeForm({
            name: b.name || "My Bike",
            oilChangeInterval: b.oilChangeInterval ?? 2000,
            lastOilChangeDate: b.lastOilChangeDate
              ? new Date(
                  b.lastOilChangeDate.seconds
                    ? b.lastOilChangeDate.seconds * 1000
                    : typeof b.lastOilChangeDate.toMillis === "function"
                      ? b.lastOilChangeDate.toMillis()
                      : b.lastOilChangeDate
                )
                  .toISOString()
                  .split("T")[0]
              : "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bike settings.");
      }
    };
    loadBike();
  }, [user, activeBikeId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid);
      const updateData = {
        mechanicPhone: formData.mechanicPhone,
        autoMessageEnabled: formData.autoMessageEnabled,
        preferredMethod: formData.preferredMethod,
        fuelEfficiencyThreshold: Number(formData.fuelEfficiencyThreshold),
      };
      await updateDoc(ref, updateData);

      if (activeBikeId) {
        const bikeRef = doc(db, "users", user.uid, "bikes", activeBikeId);
        const bikePatch = {
          name: bikeForm.name,
          oilChangeInterval: Number(bikeForm.oilChangeInterval),
        };
        if (bikeForm.lastOilChangeDate) bikePatch.lastOilChangeDate = new Date(bikeForm.lastOilChangeDate);
        await setDoc(bikeRef, bikePatch, { merge: true });
      }

      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
               <Settings className="text-cyan-400" /> App Settings
            </h1>
            <p className="text-slate-400 text-sm mt-1">Configure your bike and notification preferences.</p>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="glass rounded-2xl p-6 md:p-10 border border-white/10"
          >
             <form onSubmit={handleSave} className="space-y-8">
                
                {/* Bike Profile Section */}
                <div>
                   <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                       <Bike size={18} className="text-purple-400" /> Bike Profile
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-400 mb-1">Bike / Vehicle Name</label>
                         <input 
                           type="text" 
                           value={bikeForm.name}
                           onChange={e => setBikeForm({...bikeForm, name: e.target.value})}
                           className="glass-input w-full"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-400 mb-1">Oil Change Interval (km)</label>
                         <input 
                           type="number" 
                           value={bikeForm.oilChangeInterval}
                           onChange={e => setBikeForm({...bikeForm, oilChangeInterval: e.target.value})}
                           className="glass-input w-full"
                           min="50"
                         />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-slate-400 mb-1">Last Oil Change Date</label>
                         <input 
                           type="date" 
                           value={bikeForm.lastOilChangeDate}
                           onChange={e => setBikeForm({...bikeForm, lastOilChangeDate: e.target.value})}
                           className="glass-input w-full md:w-1/2"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-400 mb-1">Low Fuel Efficiency Alert (km/L)</label>
                         <input
                           type="number"
                           value={formData.fuelEfficiencyThreshold}
                           onChange={e => setFormData({...formData, fuelEfficiencyThreshold: e.target.value})}
                           className="glass-input w-full"
                           min="1"
                           step="0.1"
                         />
                         <p className="text-xs text-slate-500 mt-1">Dashboard shows a warning when latest fuel efficiency falls below this value.</p>
                      </div>
                   </div>
                </div>

                {/* Automation Section */}
                <div>
                   <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                       <Bell size={18} className="text-cyan-400" /> Smart Messaging
                   </h3>
                   <div className="space-y-6">
                     <div>
                         <label className="block text-sm font-medium text-slate-400 mb-1">Mechanic / Emergency Phone</label>
                         <input 
                           type="text" 
                           value={formData.mechanicPhone}
                           onChange={e => setFormData({...formData, mechanicPhone: e.target.value})}
                           placeholder="+1234567890"
                           className="glass-input w-full md:w-1/2"
                         />
                         <p className="text-xs text-slate-500 mt-1">Required if you want automated SMS or WhatsApp dispatch.</p>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 md:w-3/4">
                        <div>
                           <p className="text-white font-medium text-sm">Enable Auto-messaging</p>
                           <p className="text-xs text-slate-500">Automatically prepare a message every time you log a ride/expense. Limit: 5 per day.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={formData.autoMessageEnabled}
                              onChange={e => setFormData({...formData, autoMessageEnabled: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                     </div>

                     {formData.autoMessageEnabled && (
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3">Preferred Sending App</label>
                            <div className="flex gap-4">
                               <button 
                                  type="button"
                                  onClick={() => setFormData({...formData, preferredMethod: "wa"})}
                                  className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.preferredMethod === 'wa' ? 'bg-[#25D366]/20 border-[#25D366] text-[#25D366]' : 'glass text-slate-500 border-white/10 hover:border-white/30'}`}
                               >
                                  <Smartphone size={24} />
                                  <span className="text-sm font-semibold">WhatsApp</span>
                               </button>
                               <button 
                                  type="button"
                                  onClick={() => setFormData({...formData, preferredMethod: "sms"})}
                                  className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.preferredMethod === 'sms' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'glass text-slate-500 border-white/10 hover:border-white/30'}`}
                               >
                                  <Navigation size={24} />
                                  <span className="text-sm font-semibold">Native SMS</span>
                               </button>
                            </div>
                        </div>
                     )}
                   </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                    <Bike size={18} className="text-cyan-400" /> Active Bike
                  </h3>
                  <div className="space-y-3">
                    <select
                      value={activeBikeId || ""}
                      onChange={(e) => selectBike(e.target.value)}
                      className="glass-input w-full md:w-1/2"
                    >
                      {bikes.map((bike) => (
                        <option key={bike.id} value={bike.id}>
                          {bike.name}
                        </option>
                      ))}
                    </select>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={async () => {
                        if (!activeBikeId) return;
                        await selectBike(activeBikeId, true);
                        toast.success("Default bike updated.");
                      }}
                      className="px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium"
                    >
                      Set as default
                    </motion.button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                   <motion.button
                     type="submit"
                     disabled={saving}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full md:w-auto px-8 py-3 rounded-xl btn-glow text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                   >
                     {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                     {saving ? "Saving..." : "Save Settings"}
                   </motion.button>
                </div>
             </form>
          </motion.div>
        </div>
      </main>
    </>
  );
}
