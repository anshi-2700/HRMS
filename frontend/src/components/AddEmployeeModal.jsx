import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function AddEmployeeModal({
  isOpen,
  onClose,
  departments,
  onEmployeeCreated,
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designations, setDesignations] = useState([]);
  const [designationId, setDesignationId] = useState('');
  const [employeeId, setEmployeeId] = useState(`EMP${Math.floor(1000 + Math.random() * 9000)}`);
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (departments.length > 0 && !departmentId) {
      setDepartmentId(departments[0].id);
    }
  }, [departments]);

  useEffect(() => {
    if (departmentId) {
      api.getDesignations(departmentId).then((desigs) => {
        setDesignations(desigs);
        if (desigs.length > 0) {
          setDesignationId(desigs[0].id);
        } else {
          setDesignationId('');
        }
      });
    }
  }, [departmentId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId || !designationId) {
      setError('Please select both a department and a designation.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onEmployeeCreated({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        department_id: departmentId,
        designation_id: designationId,
        employeeid: employeeId,
        gender,
        joindate: new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Add New Employee</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Rahul"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Sharma"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="e.g. rahul@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-control"
                required
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Designation / Role</label>
              <select
                className="form-control"
                required
                value={designationId}
                onChange={(e) => setDesignationId(e.target.value)}
              >
                {designations.length > 0 ? (
                  designations.map((des) => (
                    <option key={des.id} value={des.id}>
                      {des.name}
                    </option>
                  ))
                ) : (
                  <option value="">No roles in department</option>
                )}
              </select>
            </div>
          </div>

          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">Employee Code / ID</label>
              <input
                type="text"
                className="form-control"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
