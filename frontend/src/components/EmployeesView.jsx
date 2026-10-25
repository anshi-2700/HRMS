import React, { useState } from 'react';
import { Search, Plus, Trash2, Mail, Phone, Building, Briefcase } from 'lucide-react';

export default function EmployeesView({
  employees,
  departments,
  onOpenAddModal,
  onDeleteEmployee,
  search,
  setSearch,
  selectedDepartment,
  setSelectedDepartment,
}) {
  return (
    <div>
      <div className="content-card">
        <div className="content-header">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-bar">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="search-input"
                id="search-employee-input"
                placeholder="Search by name, ID, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              id="select-department-filter"
              style={{ width: 'auto', minWidth: '160px' }}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            id="btn-add-employee"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>Add Employee</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Contact</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {emp.first_name[0]?.toUpperCase() || 'E'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {emp.full_name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{emp.employeeid}</span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Building size={14} color="var(--text-muted)" />
                        {emp.department}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={14} color="var(--text-muted)" />
                        {emp.designation}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} color="var(--text-muted)" />
                          {emp.phone || '-'}
                        </div>
                      </div>
                    </td>
                    <td>{emp.joindate || '-'}</td>
                    <td>
                      <span
                        className={`badge ${emp.is_blocked ? 'badge-danger' : 'badge-success'}`}
                      >
                        {emp.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', borderColor: 'transparent' }}
                        onClick={() => onDeleteEmployee(emp.id)}
                        title="Delete employee"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No employees matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
