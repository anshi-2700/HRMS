import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Employee } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeCreated: (emp: Omit<Employee, 'id' | 'employee_id' | 'date_of_joining'>) => Promise<void>;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onEmployeeCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [department, setDepartment] = useState('Engineering & Technology');
  const [designation, setDesignation] = useState('Senior Software Engineer');
  const [location, setLocation] = useState('Bengaluru (HQ)');
  const [salary, setSalary] = useState('1800000');
  const [panNumber, setPanNumber] = useState('');
  const [status, setStatus] = useState<'active' | 'on_leave' | 'inactive'>('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      setError('First name, last name, and email are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onEmployeeCreated({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || undefined,
        department,
        designation,
        location,
        salary: parseFloat(salary) || 1200000,
        pan_number: panNumber || 'AABCS1234F',
        status,
      });
      onClose();
      // Reset
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('+91 ');
      setPanNumber('');
    } catch (err: any) {
      setError(err.message || 'Failed to enroll personnel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserPlus size={18} className="text-blue-600" />
            Enroll New Organization Personnel
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rohan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kulkarni"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                placeholder="rohan.k@worknest.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 98203 45678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Engineering & Technology">Engineering &amp; Technology</option>
                <option value="Product Design & UI/UX">Product Design &amp; UI/UX</option>
                <option value="People Operations (HR)">People Operations (HR)</option>
                <option value="Finance & Accounts">Finance &amp; Accounts</option>
                <option value="Enterprise Client Partnerships">Enterprise Client Partnerships</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Bengaluru (HQ)">Bengaluru (HQ)</option>
                <option value="Pune Technology Center">Pune Technology Center</option>
                <option value="Hyderabad Hub">Hyderabad Hub</option>
                <option value="Mumbai Corporate Office">Mumbai Corporate Office</option>
                <option value="Gurugram Office">Gurugram Office</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                placeholder="e.g. Cloud Architect"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Annual CTC (INR)</label>
              <input
                type="number"
                required
                placeholder="1800000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">PAN Card Number (Statutory)</label>
            <input
              type="text"
              placeholder="e.g. ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              {loading ? 'Enrolling...' : 'Enroll Personnel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
