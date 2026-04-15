'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MenuItem } from '@/types/database'

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    restaurant_id: '',
    name: '',
    description: '',
    price: '',
    category: '',
  })

  const fetchMenuItems = useCallback(async () => {
    try {
      const url = form.restaurant_id
        ? `/api/admin/menu?restaurant_id=${encodeURIComponent(form.restaurant_id)}`
        : '/api/admin/menu'
      const res = await fetch(url)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setMenuItems(data.items ?? [])
      }
    } catch {
      setError('메뉴 목록을 불러오지 못했습니다.')
    }
  }, [form.restaurant_id])

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: form.restaurant_id,
          name: form.name,
          description: form.description || null,
          price: Number(form.price),
          category: form.category || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '메뉴 등록에 실패했습니다.')
      } else {
        setSuccess(`"${form.name}" 메뉴가 등록되었습니다.`)
        setForm((prev) => ({ ...prev, name: '', description: '', price: '', category: '' }))
        fetchMenuItems()
      }
    } catch {
      setError('요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">메뉴 관리</h1>
        <p className="text-sm text-muted mt-1">메뉴를 추가하고 관리합니다</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-surface p-6 mb-8"
      >
        <h2 className="text-base font-semibold text-foreground mb-5">메뉴 추가</h2>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-300 p-3 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-3 mb-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">식당 ID</label>
            <input
              type="text"
              required
              value={form.restaurant_id}
              onChange={(e) => setForm((prev) => ({ ...prev, restaurant_id: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="식당 UUID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">메뉴명</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="짜장면"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">가격 (원)</label>
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="8000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">카테고리</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="메인, 사이드, 음료"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">설명</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="메뉴에 대한 간단한 설명"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '등록 중...' : '메뉴 등록'}
        </button>
      </form>

      {/* Menu List */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">
          등록된 메뉴
          {menuItems.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted">{menuItems.length}개</span>
          )}
        </h2>
        {menuItems.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
            <p className="text-muted text-sm">등록된 메뉴가 없습니다</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">메뉴명</th>
                  <th className="px-4 py-3 text-right font-medium text-muted text-xs uppercase tracking-wider">가격</th>
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">카테고리</th>
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">설명</th>
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-accent-light/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-foreground text-right whitespace-nowrap tabular-nums">
                      {item.price.toLocaleString('ko-KR')}원
                    </td>
                    <td className="px-4 py-3 text-muted">{item.category ?? '-'}</td>
                    <td className="px-4 py-3 text-muted">{item.description ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          item.is_available
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {item.is_available ? '판매중' : '품절'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
