import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Star, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { JobPosting, Candidate } from '../types';

interface RecruitmentViewProps {
  jobs: JobPosting[];
  candidates: Candidate[];
  onRefresh?: () => void;
}

export const RecruitmentView: React.FC<RecruitmentViewProps> = ({ jobs, candidates }) => {
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'offered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'interview':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'screened':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Recruitment &amp; ATS Pipeline
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Active engineering &amp; product requisitions across Bengaluru, Pune &amp; Hyderabad tech hubs
        </p>
      </div>

      {/* Active Job Openings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span>{job.department}</span>
                <span className="text-blue-700 font-mono text-[11px] font-bold">{job.vacancies} open position(s)</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                {job.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {job.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Exp: {job.experience_level || '4-7 Yrs'}</span>
                <span className="text-blue-700 font-bold">{job.candidates_count} Applicants</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidates Evaluation Pipeline Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Candidates Evaluation Pipeline
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {candidates.length} evaluated applicants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Current Organization</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-center">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((c) => {
                const linkedJob = jobs.find(j => j.id === c.job_id);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{c.full_name}</span>
                      <span className="text-[11px] text-slate-500">{c.email} &bull; {c.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">
                      {linkedJob?.title || 'Engineering Role'}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {c.current_company || 'Tech Services'}
                    </td>
                    <td className="py-3 px-4 text-slate-900 tabular-nums font-semibold">
                      {c.experience_years} years
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{c.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStageBadge(c.stage)}`}>
                        {c.stage}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
