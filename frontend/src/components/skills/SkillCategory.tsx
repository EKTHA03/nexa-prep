import React from 'react';
import { JOB_REQUIREMENTS } from '../../config/jobRequirements';

interface SkillCategoryProps {
  selectedRole: string;
  onSelectRole: (roleId: string) => void;
}

export function SkillCategory({ selectedRole, onSelectRole }: SkillCategoryProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
        Select Target Job Role (13 Roles Available)
      </label>
      <select
        value={selectedRole}
        onChange={(e) => onSelectRole(e.target.value)}
        className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-lg"
      >
        {JOB_REQUIREMENTS.map((role) => (
          <option key={role.id} value={role.id}>
            🎯 {role.title} ({role.category})
          </option>
        ))}
      </select>
    </div>
  );
}
