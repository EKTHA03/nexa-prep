import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import type { SkillGapResult } from '../../types';

interface ResumeSkillChartProps {
  skillGap: SkillGapResult;
  extractedCount: number;
}

// Custom tooltip for the bar chart
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600/50 rounded-lg px-4 py-2 text-sm shadow-xl">
      <p className="font-semibold text-slate-100 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function ResumeSkillChart({ skillGap, extractedCount }: ResumeSkillChartProps) {
  const { fullyMatched, partiallyMatched, gaps, requiredSkills, jobRole, matchPercentage } = skillGap;

  // ── Summary stats ──────────────────────────────────────────────────────────
  const statCards = [
    { label: 'Skills Extracted', value: extractedCount, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { label: 'Fully Matched', value: fullyMatched.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Partial Match', value: partiallyMatched.length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    { label: 'Missing Skills', value: gaps.length, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
    { label: 'Match Score', value: `${matchPercentage}%`, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  ];

  // ── Bar chart data: per-skill matched vs missing ───────────────────────────
  const barData = requiredSkills.map(skill => ({
    name: skill.length > 14 ? skill.slice(0, 13) + '…' : skill,
    fullName: skill,
    Matched: fullyMatched.includes(skill) ? 1 : 0,
    Partial: partiallyMatched.includes(skill) ? 1 : 0,
    Missing: gaps.includes(skill) ? 1 : 0,
  }));

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/40 rounded-2xl p-5 space-y-5">
      {/* ── Header ── */}
      <div>
        <h3 className="text-base font-bold text-slate-100">
          📊 Resume Skill Analysis — <span className="text-indigo-400">{jobRole}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Required skills coverage at a glance
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`border rounded-xl px-3 py-2 flex flex-col items-center justify-center ${card.bg}`}
          >
            <span className={`text-xl font-black ${card.color}`}>{card.value}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 text-center leading-tight">{card.label}</span>
          </div>
        ))}
      </div>

      {/* ── Bar chart ── */}
      <div>
        <p className="text-[11px] font-medium text-slate-400 mb-2 uppercase tracking-wider">
          Skill Coverage per Required Skill
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={barData}
            margin={{ top: 4, right: 8, left: -28, bottom: 40 }}
            barSize={14}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              angle={-38}
              textAnchor="end"
              interval={0}
              height={56}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, 1]}
              tick={{ fill: '#64748b', fontSize: 9 }}
              ticks={[0, 1]}
              tickFormatter={v => (v === 1 ? '✓' : '✗')}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '4px' }}
              formatter={(value) => (
                <span style={{ color: value === 'Matched' ? '#34d399' : value === 'Partial' ? '#fbbf24' : '#f87171' }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="Matched" name="Matched" fill="#34d399" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Partial" name="Partial" fill="#fbbf24" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Missing" name="Missing" fill="#f87171" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Missing skills list ── */}
      {gaps.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-2">
            ❌ Missing Skills to Fill
          </p>
          <div className="flex flex-wrap gap-2">
            {gaps.map(skill => (
              <span
                key={skill}
                className="bg-rose-900/30 border border-rose-500/30 text-rose-300 text-[11px] font-medium px-2.5 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
