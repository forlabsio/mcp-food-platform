'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Order, OrderStatus } from '@/types/database'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '대기',
  confirmed: '확인',
  preparing: '조리중',
  ready: '준비완료',
  completed: '완료',
  cancelled: '취소',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  confirmed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  preparing: 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20',
  ready: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  completed: 'bg-stone-100 text-stone-500',
  cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
}

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; status: OrderStatus; color: string }>> = {
  pending: { label: '주문 확인', status: 'confirmed', color: 'bg-blue-600 hover:bg-blue-700' },
  confirmed: { label: '조리 시작', status: 'preparing', color: 'bg-orange-600 hover:bg-orange-700' },
  preparing: { label: '준비 완료', status: 'ready', color: 'bg-emerald-600 hover:bg-emerald-700' },
  ready: { label: '픽업 완료', status: 'completed', color: 'bg-stone-600 hover:bg-stone-700' },
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
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

  async function cancelOrder(orderId: string) {
    if (!confirm('이 주문을 취소하시겠습니까?')) return
    updateStatus(orderId, 'cancelled')
  }

  const activeOrders = orders.filter((o) => !['completed', 'cancelled'].includes(o.status))
  const pastOrders = orders.filter((o) => ['completed', 'cancelled'].includes(o.status))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">주문 현황</h1>
          <p className="text-sm text-muted mt-1">10초마다 자동 새로고침</p>
        </div>
        <button onClick={fetchOrders}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:text-foreground hover:border-accent transition-colors">
          새로고침
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 mb-6 text-sm text-red-700">{error}</div>
      )}

      {/* Active Orders */}
      <h2 className="text-base font-semibold text-foreground mb-3">
        진행 중인 주문
        {activeOrders.length > 0 && <span className="ml-2 text-sm font-normal text-accent">{activeOrders.length}건</span>}
      </h2>

      {activeOrders.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-10 text-center mb-8">
          <p className="text-muted text-sm">진행 중인 주문이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {activeOrders.map((order) => {
            const next = NEXT_STATUS[order.status]
            const isUpdating = updatingId === order.id
            const createdAt = new Date(order.created_at).toLocaleString('ko-KR', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })
            return (
              <div key={order.id} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                      <span className="text-xs text-muted font-mono">{order.id.slice(0, 8)}</span>
                      <span className="text-xs text-muted">{createdAt}</span>
                    </div>
                    <p className="text-base font-semibold text-foreground">{order.customer_name}</p>
                    <p className="text-sm text-muted">{order.customer_phone}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground tabular-nums">
                    {order.total_price.toLocaleString('ko-KR')}원
                  </p>
                </div>

                {/* Items */}
                <div className="rounded-lg bg-background p-3 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-0.5">
                      <span className="text-foreground">
                        {item.name} x{item.quantity}
                        {item.options?.length > 0 && (
                          <span className="text-muted ml-1">
                            ({item.options.map((o) => o.choice).join(', ')})
                          </span>
                        )}
                      </span>
                      <span className="text-muted tabular-nums">{(item.price * item.quantity).toLocaleString('ko-KR')}원</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <p className="text-sm text-accent mb-3">메모: {order.notes}</p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {next && (
                    <button
                      onClick={() => updateStatus(order.id, next.status)}
                      disabled={isUpdating}
                      className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${next.color} disabled:opacity-50 transition-colors`}
                    >
                      {isUpdating ? '처리중...' : next.label}
                    </button>
                  )}
                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={isUpdating}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      주문 취소
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <>
          <h2 className="text-base font-semibold text-foreground mb-3">
            완료된 주문 <span className="text-sm font-normal text-muted">{pastOrders.length}건</span>
          </h2>
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">고객</th>
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">내역</th>
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">상태</th>
                  <th className="px-4 py-3 text-right font-medium text-muted text-xs uppercase tracking-wider">합계</th>
                  <th className="px-4 py-3 text-right font-medium text-muted text-xs uppercase tracking-wider">시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pastOrders.map((order) => (
                  <tr key={order.id} className="text-muted">
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{order.total_price.toLocaleString('ko-KR')}원</td>
                    <td className="px-4 py-3 text-right text-xs">
                      {new Date(order.created_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
