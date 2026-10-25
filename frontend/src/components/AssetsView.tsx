import React, { useState } from 'react';
import { Boxes, Plus, ShieldCheck, Laptop, Cpu, Server, HardDrive, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { AssetItem } from '../types';

interface AssetsViewProps {
  assets: AssetItem[];
  onCreateAsset: (asset: Omit<AssetItem, 'id' | 'purchase_date'>) => Promise<void>;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ assets, onCreateAsset }) => {
  const [showModal, setShowModal] = useState(false);
  const [assetTag, setAssetTag] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Workstations');
  const [serialNumber, setSerialNumber] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'in_use' | 'available' | 'maintenance'>('available');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTag || !name || !value) return;

    try {
      setIsSubmitting(true);
      await onCreateAsset({
        asset_tag: assetTag,
        name,
        category,
        serial_number: serialNumber || undefined,
        assigned_to: assignedTo || undefined,
        value: parseFloat(value),
        status,
      });
      setShowModal(false);
      setAssetTag('');
      setName('');
      setSerialNumber('');
      setAssignedTo('');
      setValue('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAssetValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  const inUseCount = assets.filter((a) => a.status === 'in_use').length;
  const availableCount = assets.filter((a) => a.status === 'available').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Asset Capitalization</p>
              <h3 className="text-2xl font-bold text-white mt-1">₹{totalAssetValue.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-pink-400 mt-1">Depreciated fleet valuation</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
              <Boxes size={22} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Allocations</p>
              <h3 className="text-2xl font-bold text-white mt-1">{inUseCount} Items</h3>
              <p className="text-xs text-emerald-400 mt-1">Assigned to active workforce</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Laptop size={22} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inventory In Stock</p>
              <h3 className="text-2xl font-bold text-white mt-1">{availableCount} Available</h3>
              <p className="text-xs text-indigo-400 mt-1">Ready for immediate rollout</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Asset Registry */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server size={20} className="text-pink-400" />
              IT Infrastructure & Hardware Inventory
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Workstation serial registers, custodial tracking, and lifecycle status
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            id="btn-open-add-asset"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-pink-500/20 transition-all duration-200"
          >
            <Plus size={16} />
            <span>Register Asset</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Asset Tag</th>
                <th className="py-3 px-5">Equipment Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Serial Identifier</th>
                <th className="py-3 px-5">Assigned Custodian</th>
                <th className="py-3 px-5">Valuation</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {assets.length > 0 ? (
                assets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-mono font-semibold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded text-[11px]">
                        {a.asset_tag}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-semibold text-white">
                      {a.name}
                    </td>
                    <td className="py-4 px-5 text-slate-300">
                      {a.category}
                    </td>
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                      {a.serial_number || 'N/A'}
                    </td>
                    <td className="py-4 px-5 text-slate-200">
                      {a.assigned_to ? (
                        <span className="font-medium">{a.assigned_to}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unallocated</span>
                      )}
                    </td>
                    <td className="py-4 px-5 font-mono font-semibold text-emerald-400">
                      ₹{a.value.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-5">
                      {a.status === 'in_use' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={12} /> In Deployment
                        </span>
                      )}
                      {a.status === 'available' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <ShieldCheck size={12} /> In Stock
                        </span>
                      )}
                      {a.status === 'maintenance' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertCircle size={12} /> Maintenance
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No hardware assets registered in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes size={18} className="text-pink-400" />
                Register Hardware Asset
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Asset Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AST-009"
                  value={assetTag}
                  onChange={(e) => setAssetTag(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple MacBook Pro M3 Max"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Workstations">Workstations</option>
                    <option value="Displays">Displays</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Networking">Networking</option>
                    <option value="Audio/Video">Audio/Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="available">Available (In Stock)</option>
                    <option value="in_use">In Deployment</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-9988221"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Custodian</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Purchase Valuation (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 249000"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
                >
                  {isSubmitting ? 'Registering...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
