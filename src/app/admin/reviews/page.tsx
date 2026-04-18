'use client'

import { useState } from 'react'

/* ── Shared UI ────────────────────────────────────────────────── */
function Card({ children, title, eyebrow, accent, style }: {
  children: React.ReactNode; title?: string; eyebrow?: string; accent?: boolean; style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: 'var(--bg-1)', border: '1px solid var(--line)',
      borderRadius: 16, padding: 'var(--pad-card)', position: 'relative', overflow: 'hidden', ...style,
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

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    accent: { bg: 'rgba(255,138,61,0.14)', color: 'var(--or-500)', border: 'rgba(255,138,61,0.3)' },
    default:{ bg: 'var(--bg-3)', color: 'var(--tx-2)', border: 'var(--line-2)' },
  }
  const c = colors[tone] || colors.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 500,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  )
}

function Rating({ value }: { value: number }) {
  return (
    <span style={{ fontSize: 12, color: 'var(--or-500)', letterSpacing: 1 }}>
      {'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}
    </span>
  )
}

const REVIEWS = [
  { id: 1, author: '박서연', time: '3시간 전', rating: 5, text: '코스 메뉴 훌륭합니다. 와인 페어링 설명도 자세했어요.', via: 'direct', tag: '홀', reply: null },
  { id: 2, author: '김민정', time: '어제', rating: 5, text: '에이전트 추천대로 주문했는데 대만족. 트러플 파스타 진하고 양도 충분.', via: 'agent', tag: 'Claude', reply: '늘 방문해주셔서 감사합니다.' },
  { id: 3, author: '이재훈', time: '어제', rating: 4, text: '부라타는 최고였는데 라구가 조금 짰어요. 전체적으론 만족.', via: 'agent', tag: 'ChatGPT', reply: null },
  { id: 4, author: '한지원', time: '2일 전', rating: 5, text: '봉골레 국물이 정말 깊음. 파슬리 빼달라는 요청 반영 감사합니다.', via: 'agent', tag: 'Perplexity', reply: '요청사항 꼭 확인하고 있어요' },
  { id: 5, author: '최유나', time: '3일 전', rating: 5, text: '금요일 저녁 와인 한 잔 생각날 때마다 주문해요.', via: 'agent', tag: 'Claude', reply: null },
]

export default function ReviewsPage() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14 }}>
      {/* Left — rating summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ fontSize: 56, color: 'var(--or-500)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>4.8</div>
            <div style={{ marginTop: 8 }}><Rating value={4.8} /></div>
            <div style={{ fontSize: 11, color: 'var(--tx-2)', marginTop: 8 }}>총 312개 리뷰</div>
          </div>
          <div>
            {[
              { n: 5, pct: 0.78, count: 243 },
              { n: 4, pct: 0.16, count: 50 },
              { n: 3, pct: 0.04, count: 12 },
              { n: 2, pct: 0.01, count: 5 },
              { n: 1, pct: 0.01, count: 2 },
            ].map(r => (
              <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                <span style={{ fontSize: 10, color: 'var(--tx-2)', width: 16, fontFamily: 'var(--font-mono)' }}>{r.n}★</span>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-3)', borderRadius: 999 }}>
                  <div style={{ width: `${r.pct * 100}%`, height: '100%', background: 'var(--or-500)', borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--tx-3)', width: 26, fontFamily: 'var(--font-mono)' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="AI 요약" eyebrow="Claude analysis" accent>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: 'var(--tx-1)', lineHeight: 1.6 }}>
            <li>트러플 파스타 — 풍미·양 호평</li>
            <li>봉골레 국물 — 깊다는 평가 반복</li>
            <li style={{ color: 'var(--rd-500)' }}>라구 — 짜다는 의견 3건 ↑</li>
            <li>에이전트 추천 정확도 — 긍정적</li>
          </ul>
        </Card>
      </div>

      {/* Right — review list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {REVIEWS.map(r => (
          <Card key={r.id}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,138,61,0.14)', color: 'var(--or-500)',
                display: 'grid', placeItems: 'center',
                fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-display)',
              }}>{r.author[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--tx-0)', fontWeight: 500 }}>{r.author}</span>
                  <Rating value={r.rating} />
                  <span style={{ fontSize: 10, color: 'var(--tx-3)' }}>{r.time}</span>
                  {r.via === 'agent' && <Pill tone="accent">✦ {r.tag}</Pill>}
                </div>
                <p style={{ fontSize: 12, color: 'var(--tx-1)', margin: 0, lineHeight: 1.6 }}>{r.text}</p>
                {r.reply && (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--line)', fontSize: 11, color: 'var(--tx-1)' }}>
                    <span style={{ color: 'var(--or-500)', fontWeight: 500 }}>사장님 답글</span> — {r.reply}
                  </div>
                )}
                {!r.reply && (
                  <button style={{
                    marginTop: 10, height: 28, padding: '0 12px', borderRadius: 8,
                    fontSize: 11, color: 'var(--tx-2)', background: 'transparent',
                    border: '1px solid var(--line)', cursor: 'pointer',
                  }}>답글 작성</button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
