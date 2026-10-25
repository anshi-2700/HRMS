import React, { useState } from 'react';
import { Briefcase, UserPlus, Plus, MapPin, Users, CheckCircle2, Search, Filter, Star } from 'lucide-react';
import { JobPosting, Candidate } from '../types';

interface RecruitmentViewProps {
  jobs: JobPosting[];
  candidates: Candidate[];
  onRefresh?: () => void;
}

export const RecruitmentView: React.FC<RecruitmentViewProps> = ({ jobs, candidates, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const filteredCandidates = candidates.filter((c) => {
    const matchesStage = stageFilter === 'all' || c.stage.toLowerCase() === stageFilter.toLowerCase();
    const matchesSearch =
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageBadgeClass = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'hired':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'offered':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'interview':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'screened':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Active Job Openings Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase size={20} className="text-cyan-400" />
              Active Job Requisitions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current positions actively scouting talent across organizational units
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {jobs.filter((j) => j.status === 'active').length} Open Requisitions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {job.job_type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-500" /> {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.department}</span>
                  </div>

                  {job.description && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    <strong className="text-white">{job.vacancies}</strong> openings
                  </span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <Users size={12} /> {job.candidates_count} Applicants
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-slate-500 text-xs">
              No active job openings recorded.
            </div>
          )}
        </div>
      </div>

      {/* Candidate Pipeline Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users size={20} className="text-indigo-400" />
              Applicant Tracking Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Candidate evaluation from intake screening through final offer
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800/80 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Stages</option>
              <option value="applied">Applied</option>
              <option value="screened">Screened</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Candidate</th>
                <th className="py-3 px-5">Contact</th>
                <th className="py-3 px-5">Applied Date</th>
                <th className="py-3 px-5">Evaluation Score</th>
                <th className="py-3 px-5">Current Pipeline Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{c.full_name}</div>
                      <div className="text-[11px] text-slate-400">Requisition #{c.job_id}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-slate-200">{c.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-300 font-mono">
                      {c.applied_date}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star size={13} fill="currentColor" />
                        <span className="font-bold font-mono text-sm">{c.rating.toFixed(1)}</span>
                        <span className="text-[11px] text-slate-500">/ 5.0</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${getStageBadgeClass(c.stage)}`}>
                        {c.stage}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No candidates found for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
