'use client'

import { useState, useEffect } from 'react'
import ProfileForm from '@/components/ProfileForm'
import ChatWindow from '@/components/ChatWindow'
import InvestmentChart from '@/components/InvestmentChart'
import type { ChatMessage } from '@/types'

type Phase = 'form' | 'chat'

export default function Home() {
  useEffect(() => {
    fetch('/api/proxy/FinancialAgent/chat', { method: 'POST' }).catch(() => {})
  }, [])

  const [phase, setPhase] = useState<Phase>('form')
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false)
  const [analysisCount, setAnalysisCount] = useState(0)

  function handleSessionStarted(sid: string, firstMessage: string, complete: boolean) {
    setSessionId(sid)
    setMessages([{ role: 'agent', content: firstMessage }])
    if (complete) {
      setIsAnalysisComplete(true)
      setAnalysisCount((c) => c + 1)
    }
    setPhase('chat')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {phase === 'form' ? (
        <ProfileForm onSessionStarted={handleSessionStarted} />
      ) : (
        <div className={`w-full flex flex-col md:flex-row md:items-start gap-4 ${isAnalysisComplete ? 'max-w-6xl' : 'max-w-2xl'}`}>
          <div className={`${isAnalysisComplete ? 'md:w-1/2' : ''} w-full h-[90vh]`}>
            <ChatWindow
              sessionId={sessionId}
              messages={messages}
              isAnalysisComplete={isAnalysisComplete}
              onNewMessage={(msg) => setMessages((prev) => [...prev, msg])}
              onAnalysisComplete={() => {
                setIsAnalysisComplete(true)
                setAnalysisCount((c) => c + 1)
              }}
            />
          </div>
          {isAnalysisComplete && (
            <div className="w-full md:w-1/2 overflow-y-auto">
              <InvestmentChart sessionId={sessionId} refreshKey={analysisCount} />
            </div>
          )}
        </div>
      )}
    </main>
  )
}
