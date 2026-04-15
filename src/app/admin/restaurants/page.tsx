'use client'

import { useState, useEffect } from 'react'
import type { Restaurant } from '@/types/database'

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    business_hours: '',
    category: '',
  })

  async function fetchRestaurants() {
    const res = await fetch('/api/admin/restaurants')
    const data = await res.json()
    if (data.restaurants) setRestaurants(data.restaurants)
  }

  useEffect(() => { fetchRestaurants() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
      } else {
        setSuccess(`"${form.name}" 식당이 등록되었습니다. ID: ${data.restaurant.id}`)
        setForm({ name: '', description: '', address: '', phone: '', business_hours: '', category: '' })
        fetchRestaurants()
      }
    } catch {
      setError('요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">식당 등록</h1>
        <p className="text-sm text-muted mt-1">새 식당을 등록하고 AI Skill을 생성합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-6 mb-8">
        <h2 className="text-base font-semibold text-foreground mb-5">새 식당 추가</h2>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-300 p-3 mb-4 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-3 mb-4 text-sm text-emerald-700">{success}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">식당명 *</label>
            <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="금곡원 만두관" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">카테고리</label>
            <input type="text" value={form.category} onChange={(e) => update('category', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="중식, 한식, 일식, 분식..." />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">주소 *</label>
            <input type="text" required value={form.address} onChange={(e) => update('address', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="서울시 강남구 역삼동 123-45" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">전화번호 *</label>
            <input type="text" required value={form.phone} onChange={(e) => update('phone', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="02-1234-5678" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">영업시간</label>
            <input type="text" value={form.business_hours} onChange={(e) => update('business_hours', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="11:00-21:00 (월-토)" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">설명</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
              placeholder="20년 전통의 수제 만두 전문점" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? '등록 중...' : '식당 등록'}
        </button>
      </form>

      {/* Registered restaurants */}
      <h2 className="text-base font-semibold text-foreground mb-3">
        등록된 식당
        {restaurants.length > 0 && <span className="ml-2 text-sm font-normal text-muted">{restaurants.length}곳</span>}
      </h2>

      {restaurants.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
          <p className="text-muted text-sm">등록된 식당이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restaurants.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{r.name}</h3>
                  <p className="text-sm text-muted">{r.address}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  r.is_active ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-stone-100 text-stone-500'
                }`}>
                  {r.is_active ? '영업중' : '휴업'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span>ID: <code className="font-mono bg-background px-1.5 py-0.5 rounded">{r.id}</code></span>
                <span>{r.phone}</span>
                {r.category && <span className="rounded-md bg-accent-light text-accent px-2 py-0.5 font-medium">{r.category}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
