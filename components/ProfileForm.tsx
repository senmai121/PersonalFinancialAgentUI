'use client'

import { useState } from 'react'
import { startSession } from '@/lib/api'
import type { FinancialProfile } from '@/types'

interface Props {
  onSessionStarted: (sessionId: string, firstMessage: string, isComplete: boolean) => void
}

export default function ProfileForm({ onSessionStarted }: Props) {
  const [form, setForm] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const profile: FinancialProfile = {
      age: form.age ? parseInt(form.age) : undefined,
      occupation: form.occupation || undefined,
      monthlyIncome: form.monthlyIncome ? parseFloat(form.monthlyIncome) : undefined,
      monthlyExpenses: form.monthlyExpenses ? parseFloat(form.monthlyExpenses) : undefined,
      totalDebt: form.totalDebt ? parseFloat(form.totalDebt) : undefined,
      currentSavings: form.currentSavings ? parseFloat(form.currentSavings) : undefined,
      desiredMonthlyRetirementIncome: form.desiredMonthlyRetirementIncome
        ? parseFloat(form.desiredMonthlyRetirementIncome)
        : undefined,
      desiredRetirementAge: form.desiredRetirementAge
        ? parseInt(form.desiredRetirementAge)
        : undefined,
      riskTolerance: (form.riskTolerance as 'low' | 'medium' | 'high') || undefined,
    }

    try {
      console.log("start")
      const res = await startSession(profile)
      onSessionStarted(res.sessionId, res.message, res.isAnalysisComplete)
    } catch (err) {
      console.error('API error:', err)
      setError('ไม่สามารถเชื่อมต่อ API ได้ กรุณาตรวจสอบว่า backend กำลังทำงานอยู่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-400">Personal Financial Agent</h1>
        <p className="text-slate-400 mt-2">กรอกข้อมูลเบื้องต้นเพื่อเริ่มวิเคราะห์การเงิน</p>
        <p className="text-slate-500 text-sm mt-1">ทุกช่องเป็นตัวเลือก — กรอกเท่าที่มี</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="อายุ (ปี)" type="number" placeholder="เช่น 30">
            <input
              type="number"
              placeholder="เช่น 30"
              min={1}
              max={120}
              value={form.age ?? ''}
              onChange={(e) => handleChange('age', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="อาชีพ" type="text" placeholder="เช่น วิศวกร">
            <input
              type="text"
              placeholder="เช่น วิศวกร"
              value={form.occupation ?? ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="รายได้ต่อเดือน (บาท)">
            <input
              type="number"
              placeholder="เช่น 50000"
              min={0}
              value={form.monthlyIncome ?? ''}
              onChange={(e) => handleChange('monthlyIncome', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="ค่าใช้จ่ายต่อเดือน (บาท)">
            <input
              type="number"
              placeholder="เช่น 25000"
              min={0}
              value={form.monthlyExpenses ?? ''}
              onChange={(e) => handleChange('monthlyExpenses', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="หนี้สินทั้งหมด (บาท)">
            <input
              type="number"
              placeholder="เช่น 200000"
              min={0}
              value={form.totalDebt ?? ''}
              onChange={(e) => handleChange('totalDebt', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="เงินออมปัจจุบัน (บาท)">
            <input
              type="number"
              placeholder="เช่น 100000"
              min={0}
              value={form.currentSavings ?? ''}
              onChange={(e) => handleChange('currentSavings', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="รายได้หลังเกษียณ/เดือน (บาท)">
            <input
              type="number"
              placeholder="เช่น 30000"
              min={0}
              value={form.desiredMonthlyRetirementIncome ?? ''}
              onChange={(e) => handleChange('desiredMonthlyRetirementIncome', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="อายุเกษียณที่ต้องการ (ปี)">
            <input
              type="number"
              placeholder="เช่น 60"
              min={1}
              max={120}
              value={form.desiredRetirementAge ?? ''}
              onChange={(e) => handleChange('desiredRetirementAge', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="ระดับความเสี่ยงที่รับได้">
          <select
            value={form.riskTolerance ?? ''}
            onChange={(e) => handleChange('riskTolerance', e.target.value)}
            className={inputClass}
          >
            <option value="">-- เลือกระดับความเสี่ยง --</option>
            <option value="low">น้อย — เน้นความมั่นคง ไม่รับความผันผวน</option>
            <option value="medium">ปานกลาง — รับความผันผวนได้บ้าง</option>
            <option value="high">สูง — รับความผันผวนได้มาก เน้นผลตอบแทน</option>
          </select>
        </Field>

        {error && (
          <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? 'กำลังเชื่อมต่อ...' : 'เริ่มวิเคราะห์การเงิน →'}
        </button>
      </form>
    </div>
  )
}

const inputClass =
  'w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm'

function Field({
  label,
  children,
}: {
  label: string
  type?: string
  placeholder?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-slate-400 text-xs font-medium">{label}</label>
      {children}
    </div>
  )
}
