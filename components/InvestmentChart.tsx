'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import { getInvestmentPlan } from '@/lib/api'
import type { InvestmentAllocation } from '@/types'

const COLORS = ['#2dd4bf', '#38bdf8', '#a78bfa', '#fb923c', '#f472b6', '#34d399']

interface Props {
  sessionId: string
  refreshKey: number
}

export default function InvestmentChart({ sessionId, refreshKey }: Props) {
  const [data, setData] = useState<InvestmentAllocation[]>([])
  const [summary, setSummary] = useState('')
  const [chartType, setChartType] = useState<'bar' | 'pie'>('pie')
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getInvestmentPlan(sessionId)
      .then((plan) => {
        setData(plan.allocations)
        setSummary(plan.summary)
      })
      .catch((err) => {
        console.error('investment-plan error:', err)
        setError('ไม่สามารถโหลดข้อมูลแผนการลงทุนได้')
      })
      .finally(() => setLoading(false))
  }, [sessionId, refreshKey])

  if (loading) {
    return <p className="text-slate-400 text-sm text-center py-6">กำลังโหลดแผนการลงทุน...</p>
  }

  if (error) {
    return <p className="text-red-400 text-sm text-center py-6">{error}</p>
  }

  return (
    <div className="mt-4 bg-slate-900 border border-slate-700 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-2 text-teal-400 font-semibold text-sm hover:text-teal-300 transition-colors"
        >
          <span>{collapsed ? '▶' : '▼'}</span>
          แผนการจัดสรรการลงทุน
        </button>
        {!collapsed && (
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                chartType === 'bar'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              แท่ง
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                chartType === 'pie'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              วงกลม
            </button>
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          <ResponsiveContainer width="100%" height={260} className="mt-4">
            {chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value) => [`${value ?? 0}%`, 'สัดส่วน']}
                />
                <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="percentage"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={{ stroke: '#475569' }}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  formatter={(value) => [`${value ?? 0}%`, 'สัดส่วน']}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              </PieChart>
            )}
          </ResponsiveContainer>

          {summary && (
            <p className="text-slate-400 text-xs mt-3 leading-relaxed border-t border-slate-700 pt-3">
              {summary}
            </p>
          )}
        </>
      )}
    </div>
  )
}
