import React from 'react';
import { JobRole } from '../../types';
import { SkillTag } from '../common/SkillTag';
import { JobLinks } from './JobLinks';
import { Button } from '../common/Button';
import { Target, DollarSign, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export function JobCard({ role }: { role: JobRole }) {
  const navigate = useNavigate();
  const { setSelectedRole } = useApp();

  const handleSeeGap = () => {
    setSelectedRole(role.id);
    navigate('/skills');
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-black text-slate-100">{role.name}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {role.experienceLevel}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {role.salaryRange}</span>
            </div>
          </div>

          <div className="px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-black font-mono">
            {role.matchPercentage}% Match
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{role.description}</p>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Required Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {role.requiredSkills.map((skill, idx) => (
              <SkillTag key={idx} skill={skill} status="neutral" />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          icon={<Target className="w-4 h-4 text-indigo-400" />}
          onClick={handleSeeGap}
        >
          See Skill Gap for this Role
        </Button>

        <JobLinks
          linkedinUrl={role.linkedinUrl}
          naukriUrl={role.naukriUrl}
          internshalaUrl={role.internshalaUrl}
        />
      </div>
    </div>
  );
}
