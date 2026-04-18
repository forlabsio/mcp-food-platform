'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MenuItem } from '@/types/database'

/* ── Shared UI ────────────────────────────────────────────────── */
function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    accent:  { bg: 'rgba(255,138,61,0.14)', color: 'var(--or-500)', border: 'rgba(255,138,61,0.3)' },
    yellow:  { bg: 'rgba(229,181,71,0.14)', color: 'var(--yl-500)', border: 'rgba(229,181,71,0.3)' },
    green:   { bg: 'rgba(111,191,115,0.14)', color: 'var(--gn-500)', border: 'rgba(111,191,115,0.3)' },
    red:     { bg: 'rgba(226,86,62,0.14)', color: 'var(--rd-500)', border: 'rgba(226,86,62,0.3)' },
    solid:   { bg: 'var(--or-500)', color: '#1a0e05', border: 'var(--or-500)' },
    default: { bg: 'var(--bg-3)', color: 'var(--tx-2)', border: 'var(--line-2)' },
  }
  const c = colors[tone] || colors.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999,
      fontSize: 10, fontWeight: 500, lineHeight: '18px',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
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

/* ── Menu categories (static) ─────────────────────────────────── */
const CATEGORIES = ['전체', '파스타', '피자', '안티파스티', '메인', '디저트', '음료', '기타']

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeCat, setActiveCat] = useState('전체')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

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
      if (data.error) setError(data.error)
      else setMenuItems(data.items ?? [])
    } catch {
      setError('메뉴 목록을 불러오지 못했습니다.')
    }
  }, [form.restaurant_id])

  useEffect(() => { fetchMenuItems() }, [fetchMenuItems])

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
        setForm(prev => ({ ...prev, name: '', description: '', price: '', category: '' }))
        setShowForm(false)
        fetchMenuItems()
      }
    } catch {
      setError('요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleAvailability(item: MenuItem) {
    try {
      // We'll use PATCH if available, otherwise use the existing API
      const res = await fetch(`/api/admin/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: item.restaurant_id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
        }),
      })
      if (res.ok) fetchMenuItems()
    } catch {
      // silent fail for toggle
    }
  }

  const filtered = activeCat === '전체'
    ? menuItems
    : menuItems.filter(i => i.category === activeCat)

  return (
    <div>
      {/* Category tabs + Add button */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{
            height: 32, padding: '0 14px', borderRadius: 10,
            fontSize: 12, fontWeight: 500,
            background: activeCat === c ? 'var(--or-500)' : 'var(--bg-2)',
            color: activeCat === c ? '#1a0e05' : 'var(--tx-1)',
            border: activeCat === c ? 'none' : '1px solid var(--line)',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            {c}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowForm(!showForm)} style={{
          height: 32, padding: '0 14px', borderRadius: 10,
          fontSize: 12, fontWeight: 500,
          background: 'var(--or-500)', color: '#1a0e05',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          + 메뉴 추가
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div style={{
          marginBottom: 14, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(226,86,62,0.1)', border: '1px solid rgba(226,86,62,0.3)',
          fontSize: 12, color: 'var(--rd-500)',
        }}>{error}</div>
      )}
      {success && (
        <div style={{
          marginBottom: 14, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(111,191,115,0.1)', border: '1px solid rgba(111,191,115,0.3)',
          fontSize: 12, color: 'var(--gn-500)',
        }}>{success}</div>
      )}

      {/* Add menu form */}
      {showForm && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, margin: '0 0 16px', fontFamily: 'var(--font-display)', color: 'var(--tx-0)' }}>메뉴 추가</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[
                { label: '식당 ID', key: 'restaurant_id', placeholder: '식당 UUID', required: true },
                { label: '메뉴명', key: 'name', placeholder: '트러플 크림 파스타', required: true },
                { label: '가격 (원)', key: 'price', placeholder: '23000', type: 'number', required: true },
                { label: '카테고리', key: 'category', placeholder: '파스타' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-2)', marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    required={f.required}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', height: 36, padding: '0 12px', borderRadius: 10,
                      background: 'var(--bg-2)', border: '1px solid var(--line)',
                      color: 'var(--tx-0)', fontSize: 12, outline: 'none',
                    }}
                  />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-2)', marginBottom: 6 }}>설명</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="메뉴에 대한 간단한 설명"
                  style={{
                    width: '100%', height: 36, padding: '0 12px', borderRadius: 10,
                    background: 'var(--bg-2)', border: '1px solid var(--line)',
                    color: 'var(--tx-0)', fontSize: 12, outline: 'none',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={loading} style={{
                height: 36, padding: '0 20px', borderRadius: 10,
                background: 'var(--or-500)', color: '#1a0e05',
                fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                opacity: loading ? 0.5 : 1,
              }}>
                {loading ? '등록 중...' : '메뉴 등록'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                height: 36, padding: '0 20px', borderRadius: 10,
                background: 'transparent', color: 'var(--tx-2)',
                fontSize: 12, fontWeight: 500, border: '1px solid var(--line)', cursor: 'pointer',
              }}>
                취소
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Menu grid */}
      {filtered.length === 0 ? (
        <div style={{
          padding: 60, textAlign: 'center',
          background: 'var(--bg-1)', border: '2px dashed var(--line-2)', borderRadius: 16,
        }}>
          <div style={{ fontSize: 13, color: 'var(--tx-3)' }}>등록된 메뉴가 없습니다</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {filtered.map(item => (
            <Card key={item.id} noPad style={{ overflow: 'hidden' }}>
              {/* Image placeholder */}
              <div style={{
                height: 140, position: 'relative',
                background: 'repeating-linear-gradient(135deg, var(--bg-2) 0, var(--bg-2) 8px, var(--bg-3) 8px, var(--bg-3) 16px)',
                display: 'grid', placeItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tx-3)' }}>
                  [ {item.category || 'menu'} ]
                </span>
                {!item.is_available && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--rd-500)' }}>품절</span>
                  </div>
                )}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h4 style={{ fontSize: 14, margin: 0, color: 'var(--tx-0)', fontWeight: 500 }}>{item.name}</h4>
                  <span style={{ fontSize: 18, color: 'var(--or-500)', fontFamily: 'var(--font-display)' }}>
                    {item.price.toLocaleString()}원
                  </span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--tx-2)', lineHeight: 1.5, margin: '4px 0 12px' }}>
                  {item.description || '설명 없음'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--tx-3)', fontFamily: 'var(--font-mono)' }}>
                    {item.category || '-'}
                  </span>
                  {item.is_available ? (
                    <Pill tone="green">판매중</Pill>
                  ) : (
                    <Pill tone="red">품절</Pill>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
