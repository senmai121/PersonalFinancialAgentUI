export interface FinancialProfile {
  age?: number
  occupation?: string
  monthlyIncome?: number
  monthlyExpenses?: number
  totalDebt?: number
  currentSavings?: number
  desiredMonthlyRetirementIncome?: number
  desiredRetirementAge?: number
  riskTolerance?: 'low' | 'medium' | 'high'
}

export interface ChatResponse {
  sessionId: string
  message: string
  isAnalysisComplete: boolean
}

export interface ChatMessage {
  role: 'user' | 'agent'
  content: string
}

export interface AuthResponse {
  token: string
  username: string
  expiresAt: string
}

export interface InvestmentAllocation {
  label: string
  percentage: number
  description: string
}

export interface InvestmentPlan {
  sessionId: string
  allocations: InvestmentAllocation[]
  summary: string
}
