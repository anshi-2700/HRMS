import React, { useState } from 'react';
import { Briefcase, UserPlus, Plus, MapPin, Users, CheckCircle2 } from 'lucide-react';

export default function RecruitmentView({
  jobs,
  candidates,
  departments,
  onCreateJob,
  onUpdateCandidateStatus,
}) {
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [jobLocation, setJobLocation] = useState('Remote');
  const [jobType, setJobType] = useState('Full Time');
  const [vacancies, setVacancies] = useState(1);

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!jobTitle) return;
    onCreateJob({
      job_title: jobTitle,
      department_id: departmentId || null,
      job_location: jobLocation,
      job_type: jobType,
      vacancies: parseInt(vacancies, 10),
    });
    setShowJobModal(false);
    setJobTitle('');
  };

  const statusOptions = [
    'Applicant',
    'Interview Scheduled',
    'Interview Done',
    'Job Offered',
    'Hired',
    'Cancelled/Rejected',
  ];

  return (
    <div>
      {/* Active Jobs Section */}
      <div className="content-card" style={{ marginBottom: '24px' }}>
        <div className="content-header">
          <div>
            <h2 className="section-title">Job Openings</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Open recruitment requisitions across departments
            </p>
          </div>
          <button
            className="btn btn-primary"
            id="btn-open-create-job"
            onClick={() => setShowJobModal(true)}
          >
            <Plus size={16} />
            <span>Post New Job</span>
          </button>
        </div>

        <div className="stats-grid" style={{ marginBottom: 0 }}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="stat-card" style={{ '--card-accent': '#0ea5e9' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge badge-primary">{job.job_type}</span>
                    <span className="badge badge-success">{job.status}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {job.job_title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <MapPin size={13} />
                    <span>{job.job_location}</span>
                    <span>•</span>
                    <span>{job.department}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong>{job.vacancies}</strong> Open Positions
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '24px', color: 'var(--text-muted)' }}>No jobs posted yet.</div>
          )}
        </div>
      </div>

      {/* Candidate Pipeline Section */}
      <div className="content-card">
        <div className="content-header">
          <div>
            <h2 className="section-title">Candidate Pipeline</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Track candidate stages from applicant to hiring
            </p>
          </div>
          <span className="badge badge-purple">{candidates.length} Total Candidates</span>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Contact</th>
                <th>Job Type</th>
                <th>Skills</th>
                <th>Stage / Status</th>
                <th>Change Stage</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length > 0 ? (
                candidates.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{c.full_name}</strong>
                    </td>
                    <td>
                      <div>{c.email}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.phone}</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{c.job_type}</span>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <span style={{ fontSize: '0.82rem' }}>{c.skills || 'Python, Django, React'}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          c.status === 'Hired' || c.status === 'Job Offered'
                            ? 'badge-success'
                            : c.status?.includes('Interview')
                            ? 'badge-warning'
                            : c.status?.includes('Reject')
                            ? 'badge-danger'
                            : 'badge-purple'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                        value={c.status}
                        onChange={(e) => onUpdateCandidateStatus(c.id, e.target.value)}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No candidates found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showJobModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Post New Job Opening</h3>
              <button className="modal-close" onClick={() => setShowJobModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-control"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  <option value="">Select Department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  placeholder="e.g. Remote / Bangalore"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select
                  className="form-control"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Vacancies</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowJobModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
