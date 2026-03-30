import type { FinancialProfile, ChatResponse, InvestmentPlan } from '@/types'

const PROXY = '/api/proxy'

async function throwApiError(res: Response): Promise<never> {
  const body = await res.text()
  console.error('API error response:', res.status, body)
  try {
    const json = JSON.parse(body)
    throw new Error(json.error ?? json.message ?? `API error: ${res.status}`)
  } catch {
    throw new Error(body || `API error: ${res.status}`)
  }
}

export async function startSession(profile: FinancialProfile): Promise<ChatResponse> {
  const res = await fetch(`${PROXY}/FinancialAgent/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  })
  if (!res.ok) await throwApiError(res)
  return res.json()
}

export async function continueChat(sessionId: string, message: string): Promise<ChatResponse> {
  const res = await fetch(`${PROXY}/FinancialAgent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
  })
  if (!res.ok) await throwApiError(res)
  return res.json()
}

export async function getInvestmentPlan(sessionId: string): Promise<InvestmentPlan> {
  const res = await fetch(`${PROXY}/FinancialAgent/investment-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  if (!res.ok) await throwApiError(res)
  return res.json()
}
