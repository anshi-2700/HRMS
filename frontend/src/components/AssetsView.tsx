import React, { useState } from 'react';
import { Laptop, Plus, Tag, User, ShieldCheck, X } from 'lucide-react';
import { AssetItem } from '../types';

interface AssetsViewProps {
  assets: AssetItem[];
  onCreateAsset?: (asset: Omit<AssetItem, 'id' | 'purchase_date'>) => Promise<void>;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ assets, onCreateAsset }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Workstation');
  const [assignedTo, setAssignedTo] = useState('');
  const [serial, setSerial] = useState('');
  const [value, setValue] = useState('85000');
  const [status, setStatus] = useState<'in_use' | 'available' | 'maintenance'>('in_use');
  const [loading, setLoading] = useState(false);

  const totalCapitalValue = assets.reduce((sum, a) => sum + a.value, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag || !name) return;
    setLoading(true);
    try {
      if (onCreateAsset) {
        await onCreateAsset({
          asset_tag: tag,
          name,
          category,
          serial_number: serial || undefined,
          assigned_to: assignedTo || undefined,
          value: parseFloat(value) || 50000,
          status,
        });
      }
      setShowAddModal(false);
      setTag('');
      setName('');
      setSerial('');
      setAssignedTo('');
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Corporate IT Assets &amp; Hardware Inventory
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Workstation provisioning, serial registries, custodial allocation &amp; valuation ledger
          </p>
        </div>

        {onCreateAsset && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register IT Asset</span>
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Capitalized Value</span>
          <div className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            {formatINR(totalCapitalValue)}
          </div>
          <p className="text-xs text-blue-600 mt-1 font-semibold">Book value of deployed IT hardware</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deployed In-Use</span>
          <div className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            {assets.filter((a) => a.status === 'in_use').length} Units
          </div>
          <p className="text-xs text-emerald-700 mt-1 font-semibold">Allocated to active workforce</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Buffer Pool</span>
          <div className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            {assets.filter((a) => a.status === 'available').length} Units
          </div>
          <p className="text-xs text-amber-700 mt-1 font-semibold">Ready for new employee onboarding</p>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Asset Tag</th>
                <th className="py-3 px-4">Hardware Specification</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Custodial Assignee</th>
                <th className="py-3 px-4">Book Value</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {a.asset_tag}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{a.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">SN: {a.serial_number || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {a.category}
                  </td>
                  <td className="py-3 px-4 text-slate-900">
                    {a.assigned_to ? (
                      <span className="font-semibold">{a.assigned_to}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned (Buffer Pool)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                    {formatINR(a.value)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${a.status === 'in_use'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : a.status === 'available'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                      {a.status === 'in_use' ? 'In Use' : a.status === 'available' ? 'Available' : 'Maintenance'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Laptop size={18} className="text-blue-600" />
                Register Corporate IT Asset
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asset Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WN-AST-0107"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hardware Name &amp; Spec</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple MacBook Pro 14&quot; M3 Pro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Workstation">Workstation</option>
                    <option value="Display">Display</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Mobile">Mobile Device</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Value (INR)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. C02GL110MD6S"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Custodian</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Malhotra"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
