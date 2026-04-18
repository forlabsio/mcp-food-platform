'use client'

import { useState } from 'react'

/* ── Shared UI ────────────────────────────────────────────────── */
function Card({ children, title, eyebrow, subtitle, accent, action, style }: {
  children: React.ReactNode; title?: string; eyebrow?: string; subtitle?: string
  accent?: boolean; action?: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: 'var(--bg-1)', border: '1px solid var(--line)',
      borderRadius: 16, padding: 'var(--pad-card)', position: 'relative',
      overflow: 'hidden', ...style,
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--or-glow), transparent 70%)', pointerEvents: 'none',
        }} />
      )}
      {(title || eyebrow) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, position: 'relative' }}>
          <div>
            {eyebrow && <div style={{ fontSize: 11, color: accent ? 'var(--or-500)' : 'var(--tx-2)', marginBottom: 4 }}>{eyebrow}</div>}
            {title && <h3 style={{ fontSize: 20, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--tx-0)' }}>{title}</h3>}
            {subtitle && <div style={{ fontSize: 11, color: 'var(--tx-2)', marginTop: 4 }}>{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

function Pill({ tone, children, dot }: { tone: string; children: React.ReactNode; dot?: boolean }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    accent: { bg: 'rgba(255,138,61,0.14)', color: 'var(--or-500)', border: 'rgba(255,138,61,0.3)' },
    green:  { bg: 'rgba(111,191,115,0.14)', color: 'var(--gn-500)', border: 'rgba(111,191,115,0.3)' },
    red:    { bg: 'rgba(226,86,62,0.14)', color: 'var(--rd-500)', border: 'rgba(226,86,62,0.3)' },
    default:{ bg: 'var(--bg-3)', color: 'var(--tx-2)', border: 'var(--line-2)' },
  }
  const c = colors[tone] || colors.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 500,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.color }} />}
      {children}
    </span>
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

/* ── Mock data ────────────────────────────────────────────────── */
const MCP_CONNECTIONS = [
  { name: 'Claude Desktop', vendor: 'Anthropic', status: 'connected', latency: 42, ordersToday: 18, lastCall: '방금 전' },
  { name: 'ChatGPT', vendor: 'OpenAI', status: 'connected', latency: 68, ordersToday: 11, lastCall: '1분 전' },
  { name: 'Perplexity', vendor: 'Perplexity AI', status: 'connected', latency: 54, ordersToday: 6, lastCall: '4분 전' },
  { name: 'Cursor', vendor: 'Anysphere', status: 'idle', latency: 0, ordersToday: 0, lastCall: '2시간 전' },
  { name: 'Goose', vendor: 'Block', status: 'error', latency: 0, ordersToday: 0, lastCall: '설정 필요' },
]

const AGENT_TOOLS = [
  { name: 'menu.list', desc: '전체 메뉴와 품절 상태 조회', calls: 342, enabled: true },
  { name: 'menu.recommend', desc: '고객 프로필 기반 추천 (과거 주문·알러지 반영)', calls: 218, enabled: true },
  { name: 'order.create', desc: '신규 주문 생성 및 전달', calls: 148, enabled: true },
  { name: 'order.status', desc: '진행 중인 주문 상태 조회', calls: 96, enabled: true },
  { name: 'store.hours', desc: '매장 영업시간·브레이크 타임 안내', calls: 54, enabled: true },
  { name: 'reservation.book', desc: '테이블 예약 (홀 전용)', calls: 22, enabled: false },
]

const POLICIES = [
  { label: '품절 메뉴 자동 숨김', on: true },
  { label: '알러지 경고 필수 안내', on: true },
  { label: '객단가 30,000원 이하 자동 수락', on: true },
  { label: 'VIP 고객 우선 조리', on: true },
  { label: '이벤트 메뉴 우선 추천', on: false },
]

export default function AgentPage() {
  const [tools, setTools] = useState(AGENT_TOOLS)
  const [policies, setPolicies] = useState(POLICIES)

  function toggleTool(idx: number) {
    setTools(prev => prev.map((t, i) => i === idx ? { ...t, enabled: !t.enabled } : t))
  }
  function togglePolicy(idx: number) {
    setPolicies(prev => prev.map((p, i) => i === idx ? { ...p, on: !p.on } : p))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* MCP Connections */}
        <Card title="MCP 연결" eyebrow="Model Context Protocol">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MCP_CONNECTIONS.map(c => (
              <div key={c.name} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', background: 'var(--bg-2)',
                borderRadius: 10, border: '1px solid var(--line)',
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'var(--bg-3)', display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--tx-0)',
                }}>{c.name[0]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--tx-0)', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--tx-3)', marginTop: 2 }}>{c.vendor} · 마지막 호출 {c.lastCall}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--tx-0)', fontFamily: 'var(--font-mono)' }}>{c.ordersToday} 주문</div>
                  <div style={{ fontSize: 9, color: 'var(--tx-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{c.latency ? `${c.latency}ms` : '—'}</div>
                </div>
                <Pill tone={c.status === 'connected' ? 'green' : c.status === 'error' ? 'red' : 'default'} dot>
                  {c.status === 'connected' ? '연결됨' : c.status === 'error' ? '오류' : '대기'}
                </Pill>
              </div>
            ))}
          </div>
        </Card>

        {/* Tools */}
        <Card title="공개된 Tools" subtitle="AI 에이전트가 호출할 수 있는 함수 목록">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tools.map((t, i) => (
              <div key={t.name} style={{
                padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--line)',
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--or-500)', width: 140, flexShrink: 0 }}>{t.name}</code>
                <span style={{ flex: 1, fontSize: 11, color: 'var(--tx-1)' }}>{t.desc}</span>
                <span style={{ fontSize: 10, color: 'var(--tx-3)', fontFamily: 'var(--font-mono)' }}>{t.calls}회</span>
                <Toggle on={t.enabled} onChange={() => toggleTool(i)} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Live conversation preview */}
        <Card title="실시간 대화" eyebrow="Live session" accent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Pill tone="accent" dot>Claude Desktop</Pill>
            <span style={{ fontSize: 11, color: 'var(--tx-3)' }}>세션 시작 2분 전</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { role: 'customer', text: '크림 파스타 추천해주세요' },
              { role: 'agent', text: '트러플 크림 파스타를 추천드려요. 리뷰 48건 중 42건이 4점 이상입니다.' },
              { role: 'customer', text: '좋아. 면은 덜 익혀주세요.' },
              { role: 'agent', text: '주방에 알덴테 요청 전달드릴게요. 현재 예상 24분 후 도착입니다.' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, flexDirection: m.role === 'agent' ? 'row' : 'row-reverse' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: m.role === 'agent' ? 'var(--or-500)' : 'var(--bg-3)',
                  color: m.role === 'agent' ? '#1a0e05' : 'var(--tx-1)',
                  display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 500,
                }}>{m.role === 'agent' ? 'AI' : '고'}</div>
                <div style={{
                  background: m.role === 'agent' ? 'var(--bg-2)' : 'rgba(255,138,61,0.10)',
                  border: `1px solid ${m.role === 'agent' ? 'var(--line)' : 'rgba(255,138,61,0.20)'}`,
                  padding: '8px 11px', borderRadius: 10, fontSize: 11.5, lineHeight: 1.5,
                  color: 'var(--tx-0)', maxWidth: '85%',
                }}>{m.text}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Policies */}
        <Card title="에이전트 정책" subtitle="매장이 설정한 운영 정책 — 에이전트가 자동으로 따릅니다">
          {policies.map((p, i) => (
            <div key={p.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderBottom: '1px solid var(--line)',
            }}>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--tx-1)' }}>{p.label}</span>
              <Toggle on={p.on} onChange={() => togglePolicy(i)} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
