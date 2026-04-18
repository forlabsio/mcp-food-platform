'use client'

import { useState } from 'react'

function Card({ children, title, eyebrow, accent }: {
  children: React.ReactNode; title?: string; eyebrow?: string; accent?: boolean
}) {
  return (
    <div style={{
      background: 'var(--bg-1)', border: '1px solid var(--line)',
      borderRadius: 16, padding: 'var(--pad-card)', position: 'relative', overflow: 'hidden',
    }}>
      {accent && <div style={{
        position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--or-glow), transparent 70%)', pointerEvents: 'none',
      }} />}
      {title && (
        <div style={{ marginBottom: 14, position: 'relative' }}>
          {eyebrow && <div style={{ fontSize: 11, color: accent ? 'var(--or-500)' : 'var(--tx-2)', marginBottom: 4 }}>{eyebrow}</div>}
          <h3 style={{ fontSize: 20, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--tx-0)' }}>{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      width: 34, height: 20, borderRadius: 999,
      background: on ? 'var(--or-500)' : 'var(--bg-4)',
      position: 'relative', transition: 'all 0.15s ease',
      border: '1px solid var(--line-2)',
    }}>
      <span style={{
        position: 'absolute', top: 1, left: on ? 15 : 1,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? '#1a0e05' : 'var(--tx-1)',
        transition: 'left 0.15s ease',
      }} />
    </button>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 11, color: 'var(--tx-2)' }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--tx-0)' }}>{value}</span>
    </div>
  )
}

export default function SettingsPage() {
  const [policies, setPolicies] = useState([
    { label: '신규 주문 받기', on: true },
    { label: '배달 주문 받기', on: true },
    { label: '픽업 주문 받기', on: true },
    { label: '예약 주문 받기', on: false },
  ])

  function togglePolicy(idx: number) {
    setPolicies(prev => prev.map((p, i) => i === idx ? { ...p, on: !p.on } : p))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <Card title="매장 정보">
        <Field label="매장명" value="소담 · 성수점" />
        <Field label="주소" value="서울 성동구 성수이로 24" />
        <Field label="영업 시간" value="11:30 — 22:00" />
        <Field label="브레이크 타임" value="15:00 — 17:00" />
        <Field label="연락처" value="02-•••-1234" />
      </Card>

      <Card title="영업 상태" eyebrow="Live" accent>
        {policies.map((p, i) => (
          <div key={p.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderBottom: '1px solid var(--line)',
          }}>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--tx-1)' }}>{p.label}</span>
            <Toggle on={p.on} onChange={() => togglePolicy(i)} />
          </div>
        ))}
        <div style={{ marginTop: 14, padding: 14, background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 6 }}>브레이크 타임 알림</div>
          <div style={{ fontSize: 12, color: 'var(--tx-1)' }}>AI 에이전트가 브레이크 타임 동안 자동으로 주문을 보류합니다.</div>
        </div>
      </Card>
    </div>
  )
}
