'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const map: Record<string, { bg: string; color: string; border: string }> = {
    accent:  { bg: 'rgba(255,138,61,0.14)', color: 'var(--or-500)', border: 'rgba(255,138,61,0.3)' },
    blue:    { bg: 'rgba(107,168,201,0.14)', color: 'var(--bl-500)', border: 'rgba(107,168,201,0.3)' },
    yellow:  { bg: 'rgba(229,181,71,0.14)', color: 'var(--yl-500)', border: 'rgba(229,181,71,0.3)' },
    green:   { bg: 'rgba(111,191,115,0.14)', color: 'var(--gn-500)', border: 'rgba(111,191,115,0.3)' },
    red:     { bg: 'rgba(226,86,62,0.14)', color: 'var(--rd-500)', border: 'rgba(226,86,62,0.3)' },
    default: { bg: 'var(--bg-3)', color: 'var(--tx-2)', border: 'var(--line-2)' },
  }
  return map[tone] || map.default
}

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

function timeSince(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diff < 1) return '방금 전'
  if (diff < 60) return `${diff}분 전`
  return `${Math.floor(diff / 60)}시간 전`
}

/* ── Kanban columns ───────────────────────────────────────────── */
const COLUMNS = [
  { id: 'pending',   label: '신규',     statuses: ['pending'] as OrderStatus[] },
  { id: 'confirmed', label: '수락',     statuses: ['confirmed'] as OrderStatus[] },
  { id: 'preparing', label: '조리 중',   statuses: ['preparing'] as OrderStatus[] },
  { id: 'ready',     label: '준비 완료', statuses: ['ready'] as OrderStatus[] },
  { id: 'completed', label: '완료',     statuses: ['completed', 'cancelled'] as OrderStatus[] },
]

/* ── Mini Order Card (Kanban) ─────────────────────────────────── */
function MiniOrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <div onClick={onClick} className="fade" style={{
      background: 'var(--bg-2)', border: '1px solid var(--line)',
      borderRadius: 10, padding: 11, cursor: 'pointer',
      transition: 'all 0.15s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--tx-0)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
          #{order.id.slice(0, 6)}
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--tx-0)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {order.customer_name}
      </div>
      <div style={{ fontSize: 10, color: 'var(--tx-2)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {order.items[0]?.name}{order.items.length > 1 && ` +${order.items.length - 1}`}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--or-500)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
          {order.total_price.toLocaleString()}원
        </span>
        <span style={{ fontSize: 9, color: 'var(--tx-3)', whiteSpace: 'nowrap' }}>{timeSince(order.created_at)}</span>
      </div>
    </div>
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
      <aside onClick={e => e.stopPropagation()} className="slide" style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 520, background: 'var(--bg-0)',
        borderLeft: '1px solid var(--line-2)',
        overflowY: 'auto',
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
          <Pill tone={sp.tone} dot>{sp.label}</Pill>
        </div>

        <div style={{ padding: 26 }}>
          {/* Customer */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: 'var(--tx-2)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>고객</div>
            <div style={{ padding: '12px 14px', background: 'var(--bg-1)', borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13, color: 'var(--tx-0)', fontWeight: 500 }}>{order.customer_name}</div>
              <div style={{ fontSize: 11, color: 'var(--tx-2)', marginTop: 2 }}>{order.customer_phone}</div>
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
            <div style={{ marginBottom: 22, padding: '10px 12px', background: 'rgba(255,138,61,0.06)', border: '1px solid rgba(255,138,61,0.18)', borderRadius: 10, fontSize: 11, color: 'var(--tx-1)' }}>
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

/* ── Main OrdersPage ──────────────────────────────────────────── */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [layout, setLayout] = useState<'kanban' | 'list' | 'card'>('kanban')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (!data.error) setOrders(data.orders ?? [])
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [fetchOrders])

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

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  }

  const layouts = [
    { id: 'kanban' as const, label: '칸반', icon: '▦' },
    { id: 'list' as const, label: '리스트', icon: '☰' },
    { id: 'card' as const, label: '카드', icon: '▤' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Pill tone="accent" dot>신규 {statusCounts.pending}</Pill>
        <Pill tone="yellow" dot>조리 중 {statusCounts.preparing}</Pill>
        <Pill tone="green" dot>준비 완료 {statusCounts.ready}</Pill>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 10, padding: 3 }}>
          {layouts.map(o => (
            <button key={o.id} onClick={() => setLayout(o.id)} style={{
              height: 28, padding: '0 12px', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
              background: layout === o.id ? 'var(--bg-3)' : 'transparent',
              color: layout === o.id ? 'var(--tx-0)' : 'var(--tx-2)',
              cursor: 'pointer', border: 'none',
            }}>
              {o.icon} {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban view */}
      {layout === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {COLUMNS.map(col => {
            const colOrders = orders.filter(o => col.statuses.includes(o.status))
            return (
              <div key={col.id} style={{
                background: 'var(--bg-1)', border: '1px solid var(--line)',
                borderRadius: 16, padding: 12, minHeight: 420,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 12px' }}>
                  <span style={{ fontSize: 12, color: 'var(--tx-0)', fontWeight: 500, whiteSpace: 'nowrap' }}>{col.label}</span>
                  <Pill tone="default">{colOrders.length}</Pill>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {colOrders.map(o => <MiniOrderCard key={o.id} order={o} onClick={() => setSelected(o)} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {layout === 'list' && (
        <Card noPad>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)' }}>
                {['주문', '고객', '메뉴', '상태', '금액', '시간'].map(h =>
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 16px', fontSize: 10,
                    color: 'var(--tx-2)', textTransform: 'uppercase',
                    letterSpacing: '0.08em', fontWeight: 500,
                    borderBottom: '1px solid var(--line)',
                  }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const sp = STATUS_MAP[o.status]
                return (
                  <tr key={o.id} onClick={() => setSelected(o)} style={{
                    cursor: 'pointer', borderBottom: '1px solid var(--line)',
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--tx-0)' }}>
                      #{o.id.slice(0, 6)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--tx-0)' }}>
                      {o.customer_name}
                      <div style={{ fontSize: 10, color: 'var(--tx-3)' }}>{o.customer_phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 11, color: 'var(--tx-1)' }}>
                      {o.items[0]?.name}{o.items.length > 1 && <span style={{ color: 'var(--tx-3)' }}> +{o.items.length - 1}</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Pill tone={sp.tone}>{sp.label}</Pill>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--tx-0)' }}>
                      {o.total_price.toLocaleString()}원
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 11, color: 'var(--tx-2)' }}>
                      {timeSince(o.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Card view */}
      {layout === 'card' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {orders.map(o => {
            const sp = STATUS_MAP[o.status]
            const pct = o.status === 'completed' ? 1 : o.status === 'ready' ? 0.6 : o.status === 'preparing' ? 0.4 : o.status === 'confirmed' ? 0.2 : 0.05
            return (
              <div key={o.id} onClick={() => setSelected(o)} className="fade" style={{
                background: 'var(--bg-1)', border: '1px solid var(--line)',
                borderRadius: 14, padding: 14, cursor: 'pointer',
                transition: 'all 0.14s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--tx-0)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>#{o.id.slice(0, 6)}</span>
                  <Pill tone={sp.tone}>{sp.label}</Pill>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--tx-0)', fontWeight: 500 }}>{o.customer_name}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx-2)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{timeSince(o.created_at)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, color: 'var(--tx-0)', fontFamily: 'var(--font-display)' }}>{o.total_price.toLocaleString()}원</div>
                    <div style={{ fontSize: 10, color: 'var(--tx-2)', marginTop: 2 }}>{o.items.length}개 메뉴</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--tx-2)' }}>🛒</span>
                  <div style={{ flex: 1, height: 3, background: 'var(--bg-3)', borderRadius: 999, margin: '0 6px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${pct * 100}%`,
                      background: 'linear-gradient(90deg, var(--or-700), var(--or-500))',
                      borderRadius: 999,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--tx-2)' }}>📍</span>
                </div>
              </div>
            )
          })}
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
