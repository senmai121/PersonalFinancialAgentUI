'use client'

import { useEffect, useRef, useState } from 'react'
import { continueChat } from '@/lib/api'
import type { ChatMessage } from '@/types'

interface Props {
  sessionId: string
  messages: ChatMessage[]
  isAnalysisComplete: boolean
  onNewMessage: (msg: ChatMessage) => void
  onAnalysisComplete: () => void
}

export default function ChatWindow({
  sessionId,
  messages,
  isAnalysisComplete,
  onNewMessage,
  onAnalysisComplete,
}: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError('')
    onNewMessage({ role: 'user', content: text })
    setLoading(true)

    try {
      const res = await continueChat(sessionId, text)
      onNewMessage({ role: 'agent', content: res.message })
      if (res.isAnalysisComplete) {
        onAnalysisComplete()
      }
    } catch {
      setError('ส่งข้อความไม่สำเร็จ กรุณาลองอีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full flex flex-col h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-teal-400">Personal Financial Agent</h1>
          <p className="text-slate-500 text-xs">Session: {sessionId.slice(0, 8)}...</p>
        </div>
        {isAnalysisComplete && (
          <span className="bg-emerald-900 border border-emerald-600 text-emerald-300 text-sm px-3 py-1 rounded-full">
            ✓ การวิเคราะห์เสร็จสมบูรณ์
          </span>
        )}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-slate-900 border border-slate-700 rounded-2xl p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-teal-700 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'
              }`}
            >
              {msg.role === 'agent' && (
                <span className="block text-xs text-teal-400 font-medium mb-1">AI Agent</span>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="block text-xs text-teal-400 font-medium mb-1">AI Agent</span>
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-3 py-2 mt-2">
          {error}
        </p>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2 items-end">
        <textarea
          rows={2}
          placeholder={
            isAnalysisComplete
              ? 'มีคำถามเพิ่มเติมหรือต้องการข้อมูลอื่น...'
              : 'พิมพ์คำตอบหรือข้อมูลเพิ่มเติม...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm resize-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-semibold transition-colors self-stretch"
        >
          ส่ง
        </button>
      </div>
      <p className="text-slate-600 text-xs mt-1.5 text-center">Enter เพื่อส่ง · Shift+Enter ขึ้นบรรทัดใหม่</p>
    </div>
  )
}
