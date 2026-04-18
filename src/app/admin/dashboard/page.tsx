'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Order, OrderStatus } from '@/types/database'

/* ── Status helpers ───────────────────────────────────────────── */
const STATUS_MAP: Record<OrderStatus, { label: string; tone: string }> = {
  pending:   { label: '신규',     tone: 'accent' },
  confirmed: { label: '수락',     tone: 'blue' },
  preparing: { label: '조리 중',  tone: 'yellow' },
  ready:     { label: '준비 완료', tone: 'green' },
  completed: { label: '완료',     tone: 'default' },
  cancelled: { label: '취소',     tone: 'red' },
}

const NEXT_ACTION: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  pending:   { label: '주문 확인', next: 'confirmed' },
  confirmed: { label: '조리 시작', next: 'preparing' },
  preparing: { label: '준비 완료', next: 'ready' },
  ready:     { label: '픽업 완료', next: 'completed' },
}

function pillColor(tone: string) {
  switch (tone) {
    case 'accent':  return { bg: 'rgba(255,138,61,0.14)', color: 'var(--or-500)', border: 'rgba(255,138,61,0.3)' }
    case 'blue':    return { bg: 'rgba(107,168,201,0.14)', color: 'var(--bl-500)', border: 'rgba(107,168,201,0.3)' }
    case 'yellow':  return { bg: 'rgba(229,181,71,0.14)', color: 'var(--yl-500)', border: 'rgba(229,181,71,0.3)' }
    case 'green':   return { bg: 'rgba(111,191,115,0.14)', color: 'var(--gn-500)', border: 'rgba(111,191,115,0.3)' }
    case 'red':     return { bg: 'rgba(226,86,62,0.14)', color: 'var(--rd-500)', border: 'rgba(226,86,62,0.3)' }
    default:        return { bg: 'var(--bg-3)', color: 'var(--tx-2)', border: 'var(--line-2)' }
  }
}

/* ── Pill component ───────────────────────────────────────────── */
function Pill({ tone, children, dot }: { tone: string; children: React.ReactNode; dot?: boolean }) {
  const c = pillColor(tone)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 999,
      fontSize: 10, fontWeight: 500, lineHeight: '18px',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.color }} />}
      {children}
    </span>
  )
}

/* ── Card wrapper ─────────────────────────────────────────────── */
function Card({ children, noPad, style }: { children: React.ReactNode; noPad?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--bg-1)', border: '1px solid var(--line)',
      borderRadius: 16, padding: noPad ? 0 : 'var(--pad-card)',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── Progress bar helpers ─────────────────────────────────────── */
function progressPct(status: OrderStatus): number {
  switch (status) {
    case 'pending':   return 0.05
    case 'confirmed': return 0.2
    case 'preparing': return 0.4
    case 'ready':     return 0.6
    case 'completed': return 1
    case 'cancelled': return 0
  }
}

function timeSince(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diff < 1) return '방금 전'
  if (diff < 60) return `${diff}분 전`
  return `${Math.floor(diff / 60)}시간 전`
}

/* ── Tracking Card ────────────────────────────────────────────── */
function TrackingCard({ order, selected, onClick }: {
  order: Order; selected: boolean; onClick: () => void
}) {
  const sp = STATUS_MAP[order.status]
  const pct = progressPct(order.status)
  return (
    <div onClick={onClick} className="fade" style={{
      background: selected ? 'var(--bg-2)' : 'var(--bg-1)',
      border: `1px solid ${selected ? 'var(--or-500)' : 'var(--line)'}`,
      boxShadow: selected ? '0 0 0 3px var(--or-glow)' : 'none',
      borderRadius: 14, padding: 14, cursor: 'pointer',
      transition: 'all 0.14s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--tx-0)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
          #{order.id.slice(0, 6)}
        </span>
        <Pill tone={sp.tone}>{sp.label}</Pill>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--tx-0)', fontWeight: 500 }}>{order.customer_name}</div>
          <div style={{ fontSize: 10, color: 'var(--tx-2)', marginTop: 2 }}>{order.customer_phone}</div>
          <div style={{ fontSize: 10, color: 'var(--tx-2)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            {timeSince(order.created_at)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, color: 'var(--tx-0)', fontFamily: 'var(--font-display)' }}>
            {order.total_price.toLocaleString()}원
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx-2)', marginTop: 2 }}>
            {order.items.length}개 메뉴
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <span style={{ fontSize: 11, color: 'var(--tx-2)' }}>🛒</span>
        <div style={{ flex: 1, height: 3, background: 'var(--bg-3)', borderRadius: 999, margin: '0 6px', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${pct * 100}%`,
            background: 'linear-gradient(90deg, var(--or-700), var(--or-500))',
            borderRadius: 999,
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: `${pct * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--or-500)',
            boxShadow: '0 0 0 3px var(--bg-1), 0 0 12px var(--or-glow)',
          }} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--tx-2)' }}>📍</span>
      </div>
    </div>
  )
}

/* ── Tracking List Widget (left column) ───────────────────────── */
function TrackingListWidget({ orders, onSelect, selectedId }: {
  orders: Order[]; onSelect: (o: Order) => void; selectedId: string | null
}) {
  return (
    <Card noPad style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 6 }}>실시간</div>
          <h3 style={{ fontSize: 24, margin: 0, lineHeight: 1.05, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>주문 현황</h3>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx-3)', fontSize: 12 }}>
            주문이 없습니다
          </div>
        ) : (
          orders.map(o => (
            <TrackingCard key={o.id} order={o}
              selected={selectedId === o.id}
              onClick={() => onSelect(o)} />
          ))
        )}
      </div>
    </Card>
  )
}

/* ── Live Order Map ───────────────────────────────────────────── */
function LiveOrderMap({ activeCount }: { activeCount: number }) {
  return (
    <Card noPad style={{ height: 380, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 4 }}>진행 중인 주문</div>
          <h3 style={{ fontSize: 22, margin: 0, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
            활성 주문 <span style={{ color: 'var(--or-500)' }}>· {activeCount}건</span>
          </h3>
        </div>
      </div>
      {/* Stylized map background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 70% 40%, rgba(255,138,61,0.10) 0%, transparent 50%),
          radial-gradient(ellipse at 30% 70%, rgba(107,168,201,0.06) 0%, transparent 50%),
          var(--map-bg)
        `,
      }}>
        <svg width="100%" height="100%" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            <linearGradient id="route" x1="0" x2="1">
              <stop offset="0" stopColor="#FF8A3D" stopOpacity="0.2" />
              <stop offset="0.6" stopColor="#FF8A3D" stopOpacity="1" />
              <stop offset="1" stopColor="#FFB079" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M 0 220 Q 100 200 200 230 T 400 200 T 600 180" stroke="rgba(255,255,255,0.07)" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M 80 0 Q 100 100 60 200 T 140 380" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 460 0 Q 480 80 500 180 T 540 380" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 280 0 Q 260 80 320 160 T 380 380" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 100 240 Q 200 200 300 220 T 480 140" stroke="url(#route)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Store marker */}
          <g transform="translate(100,240)">
            <circle r="12" fill="rgba(20,20,22,0.9)" stroke="#FF8A3D" strokeWidth="1.5" />
            <circle r="4" fill="#FF8A3D" />
            <text y="28" textAnchor="middle" fill="#C9C5BD" fontSize="9" fontFamily="var(--font-mono)">소담 매장</text>
          </g>
          {/* Courier */}
          <g transform="translate(330,210)">
            <circle r="14" fill="rgba(255,138,61,0.18)" />
            <circle r="9" fill="#FF8A3D" />
            <path d="M -4 -1 L 4 -1 L 2 3 L -2 3 Z" fill="#1a0e05" />
          </g>
          <g transform="translate(480,140)">
            <circle r="9" fill="rgba(20,20,22,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <circle r="3" fill="#C9C5BD" />
          </g>
        </svg>
      </div>
    </Card>
  )
}

/* ── Kitchen Status ───────────────────────────────────────────── */
function KitchenStatus({ orders }: { orders: Order[] }) {
  const items = [
    {
      label: '조리 중인 주문',
      count: orders.filter(o => o.status === 'preparing').length,
      icon: '🔥',
      tone: 'yellow' as const,
    },
    {
      label: '준비 완료 픽업 대기',
      count: orders.filter(o => o.status === 'ready').length,
      icon: '🛍',
      tone: 'green' as const,
    },
    {
      label: '대기 중인 주문',
      count: orders.filter(o => o.status === 'pending').length,
      icon: '⏳',
      tone: 'accent' as const,
    },
  ]
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <h3 style={{ fontSize: 20, margin: 0, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>주방 현황</h3>
        <Pill tone="default">실시간</Pill>
      </div>
      {items.map((it, i) => {
        const bg = it.tone === 'yellow' ? 'rgba(229,181,71,0.14)'
          : it.tone === 'green' ? 'rgba(111,191,115,0.14)'
          : 'rgba(255,138,61,0.14)'
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            background: 'var(--bg-2)', borderRadius: 12, marginBottom: 8,
            border: '1px solid var(--line)',
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: bg,
              display: 'grid', placeItems: 'center', fontSize: 14,
            }}>{it.icon}</span>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--tx-1)' }}>{it.label}</span>
            <span style={{ fontSize: 18, color: 'var(--tx-0)', fontFamily: 'var(--font-display)' }}>{it.count}</span>
          </div>
        )
      })}
    </Card>
  )
}

/* ── AI Agent Live (chat preview) ─────────────────────────────── */
function AIAgentLive() {
  return (
    <Card style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--or-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, position: 'relative' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 4 }}>MCP 실시간</div>
          <h3 style={{ fontSize: 20, margin: 0, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
            AI 에이전트 <span style={{ color: 'var(--or-500)' }}>·</span> Claude Desktop
          </h3>
        </div>
        <Pill tone="green" dot>활성</Pill>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: 'var(--bg-3)', color: 'var(--tx-1)',
            display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 500,
          }}>고</div>
          <div style={{
            background: 'rgba(255,138,61,0.10)',
            border: '1px solid rgba(255,138,61,0.20)',
            color: 'var(--tx-0)', fontSize: 11.5, lineHeight: 1.5,
            padding: '8px 11px', borderRadius: 10, maxWidth: '85%',
          }}>크림 파스타 추천해주세요</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: 'var(--or-500)', color: '#1a0e05',
            display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 500,
          }}>AI</div>
          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            color: 'var(--tx-0)', fontSize: 11.5, lineHeight: 1.5,
            padding: '8px 11px', borderRadius: 10, maxWidth: '85%',
          }}>트러플 크림 파스타를 추천드려요. 리뷰 48건 중 42건이 4점 이상입니다.</div>
        </div>
      </div>

      <div style={{
        padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 10,
        border: '1px dashed var(--line-2)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ color: 'var(--or-500)', fontSize: 13 }}>✦</span>
        <span style={{ fontSize: 11, color: 'var(--tx-2)', whiteSpace: 'nowrap' }}>오늘 추천 적중률</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--or-500)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>87%</span>
      </div>
    </Card>
  )
}

/* ── Stat row ─────────────────────────────────────────────────── */
function Stat({ label, value, delta, accent, alt }: {
  label: string; value: string | number; delta?: string; accent?: boolean; alt?: boolean
}) {
  return (
    <div style={{
      padding: '10px 0', borderBottom: '1px solid var(--line)',
      paddingLeft: alt ? 14 : 0,
      borderLeft: alt ? '1px solid var(--line)' : 'none',
    }}>
      <div style={{ fontSize: 10, color: 'var(--tx-2)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 18, color: accent ? 'var(--or-500)' : 'var(--tx-0)', fontFamily: 'var(--font-display)' }}>{value}</span>
        {delta && <span style={{ fontSize: 10, color: 'var(--gn-500)', fontFamily: 'var(--font-mono)' }}>{delta}</span>}
      </div>
    </div>
  )
}

/* ── Today's Overview ─────────────────────────────────────────── */
function TodaysOverview({ orders }: { orders: Order[] }) {
  const counts = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    active: orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length,
  }), [orders])

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <h3 style={{ fontSize: 20, margin: 0, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>오늘 현황</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <Stat label="신규 주문" value={counts.pending} />
        <Stat label="완료" value={counts.completed} alt />
        <Stat label="조리 중" value={counts.preparing} />
        <Stat label="활성 주문" value={counts.active} alt />
      </div>
    </Card>
  )
}

/* ── Agent Efficiency chart ───────────────────────────────────── */
function AgentEfficiency() {
  const data = [3, 2.5, 3.5, 3.2, 4.2, 5.1, 4.8, 5.8, 6.4, 5.9, 6.8]
  const max = Math.max(...data)
  const w = 260
  const h = 70
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ')
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <h3 style={{ fontSize: 20, margin: 0, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>에이전트 효율</h3>
        <Pill tone="green">+18% ↑</Pill>
      </div>
      <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 12 }}>주문 전환율 · MCP 도입 후</div>
      <svg width="100%" height={h + 12} viewBox={`0 0 ${w} ${h + 12}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="ae" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#ae)" />
        <polyline points={pts} fill="none" stroke="#FF8A3D" strokeWidth="1.5" />
        <circle cx={(10 / (data.length - 1)) * w} cy={h - (6.8 / max) * h} r="3" fill="#FF8A3D" stroke="#161618" strokeWidth="1.5" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: 'var(--tx-3)', whiteSpace: 'nowrap' }}>
        <span>● 이번 주</span>
        <span>○ 지난 주</span>
      </div>
    </Card>
  )
}

/* ── Daily Revenue ────────────────────────────────────────────── */
function DailyRevenue({ orders }: { orders: Order[] }) {
  const total = orders.reduce((s, o) => s + o.total_price, 0)
  const avg = orders.length > 0 ? Math.round(total / orders.length) : 0

  function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '10px 0', borderBottom: '1px solid var(--line)',
      }}>
        <span style={{ fontSize: 12, color: 'var(--tx-1)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{
          fontSize: highlight ? 16 : 13,
          color: highlight ? 'var(--or-500)' : 'var(--tx-0)',
          fontFamily: highlight ? 'var(--font-display)' : 'var(--font-mono)',
          fontWeight: highlight ? 400 : 500,
          whiteSpace: 'nowrap',
        }}>{value}</span>
      </div>
    )
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <h3 style={{ fontSize: 20, margin: 0, whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>오늘 매출</h3>
        <Pill tone="default">오늘</Pill>
      </div>
      <Row label="총 매출" value={`${total.toLocaleString()}원`} highlight />
      <Row label="평균 객단가" value={`${avg.toLocaleString()}원`} />
      <Row label="총 주문수" value={`${orders.length}건`} />
    </Card>
  )
}

/* ── Order Detail Drawer ──────────────────────────────────────── */
function OrderDetailDrawer({ order, onClose, onUpdateStatus, updating }: {
  order: Order; onClose: () => void; onUpdateStatus: (id: string, status: OrderStatus) => void; updating: boolean
}) {
  const sp = STATUS_MAP[order.status]
  const next = NEXT_ACTION[order.status]
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50,
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <aside onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 520, background: 'var(--bg-0)',
        borderLeft: '1px solid var(--line-2)',
        overflowY: 'auto', animation: 'slideRight 0.2s ease-out',
      }}>
        <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 4 }}>Order</div>
              <h2 style={{ fontSize: 28, margin: 0, color: 'var(--tx-0)', fontFamily: 'var(--font-display)' }}>
                #{order.id.slice(0, 8)}
              </h2>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, background: 'var(--bg-2)',
              border: '1px solid var(--line)', display: 'grid', placeItems: 'center',
              color: 'var(--tx-1)', fontSize: 16,
            }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Pill tone={sp.tone} dot>{sp.label}</Pill>
          </div>
        </div>

        <div style={{ padding: 26 }}>
          {/* Customer */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>고객</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', background: 'var(--bg-1)', borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: 'rgba(255,138,61,0.14)',
                color: 'var(--or-500)', display: 'grid', placeItems: 'center',
                fontSize: 16, fontWeight: 500, fontFamily: 'var(--font-display)',
              }}>{order.customer_name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--tx-0)', fontWeight: 500 }}>{order.customer_name}</div>
                <div style={{ fontSize: 11, color: 'var(--tx-2)', marginTop: 2 }}>{order.customer_phone}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>주문 메뉴</div>
            <div style={{ background: 'var(--bg-1)', borderRadius: 12, border: '1px solid var(--line)', overflow: 'hidden' }}>
              {order.items.map((it, i) => (
                <div key={i} style={{ padding: '12px 14px', borderBottom: i < order.items.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ color: 'var(--or-500)', fontFamily: 'var(--font-mono)', fontSize: 11, marginRight: 8 }}>×{it.quantity}</span>
                      <span style={{ fontSize: 13, color: 'var(--tx-0)' }}>{it.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--tx-1)', fontFamily: 'var(--font-mono)' }}>
                      {(it.price * it.quantity).toLocaleString()}원
                    </span>
                  </div>
                  {it.options && it.options.length > 0 && (
                    <div style={{ marginTop: 6, marginLeft: 26, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {it.options.map((o, oi) => <Pill key={oi} tone="default">{o.choice}</Pill>)}
                    </div>
                  )}
                </div>
              ))}
              <div style={{ padding: '14px 14px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-2)' }}>
                <span style={{ fontSize: 12, color: 'var(--tx-1)' }}>합계</span>
                <span style={{ fontSize: 20, color: 'var(--or-500)', fontFamily: 'var(--font-display)' }}>{order.total_price.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div style={{ marginBottom: 22, padding: '10px 12px', background: 'rgba(255,138,61,0.06)', border: '1px solid rgba(255,138,61,0.18)', borderRadius: 10, fontSize: 11, color: 'var(--tx-1)', lineHeight: 1.55 }}>
              <span style={{ color: 'var(--or-500)', fontWeight: 500 }}>메모:</span> {order.notes}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {next && (
              <button
                onClick={() => onUpdateStatus(order.id, next.next)}
                disabled={updating}
                style={{
                  flex: 2, height: 44, borderRadius: 12,
                  background: 'var(--or-500)', color: '#1a0e05',
                  fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                  opacity: updating ? 0.5 : 1,
                }}
              >
                {updating ? '처리중...' : next.label}
              </button>
            )}
            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                disabled={updating}
                style={{
                  flex: 1, height: 44, borderRadius: 12,
                  background: 'transparent', color: 'var(--rd-500)',
                  fontSize: 13, fontWeight: 500,
                  border: '1px solid rgba(226,86,62,0.3)', cursor: 'pointer',
                  opacity: updating ? 0.5 : 1,
                }}
              >
                거절
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

/* ── Main DashboardPage ───────────────────────────────────────── */
export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.error) setError(data.error)
      else setOrders(data.orders ?? [])
    } catch {
      setError('주문 목록을 불러오지 못했습니다.')
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  // Keep selected order in sync with latest fetched data
  useEffect(() => {
    if (selected) {
      const updated = orders.find(o => o.id === selected.id)
      if (updated) setSelected(updated)
    }
  }, [orders, selected])

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) fetchOrders()
    } finally {
      setUpdatingId(null)
    }
  }

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status))

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr 320px',
      gap: 'var(--gap-grid)',
      minHeight: 'calc(100vh - 96px)',
    }}>
      {/* Left column — order tracking list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-grid)', height: 'calc(100vh - 96px)' }}>
        <TrackingListWidget
          orders={orders.slice(0, 10)}
          onSelect={setSelected}
          selectedId={selected?.id ?? null}
        />
      </div>

      {/* Center column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-grid)' }}>
        <LiveOrderMap activeCount={activeOrders.length} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-grid)' }}>
          <KitchenStatus orders={orders} />
          <AIAgentLive />
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-grid)' }}>
        <TodaysOverview orders={orders} />
        <AgentEfficiency />
        <DailyRevenue orders={orders} />
      </div>

      {error && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(226,86,62,0.9)', color: '#fff',
          padding: '10px 20px', borderRadius: 10, fontSize: 12, zIndex: 100,
        }}>
          {error}
        </div>
      )}

      {/* Order detail drawer */}
      {selected && (
        <OrderDetailDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
          updating={updatingId === selected.id}
        />
      )}
    </div>
  )
}
