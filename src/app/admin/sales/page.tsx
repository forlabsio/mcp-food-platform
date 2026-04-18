'use client'

/* ── Shared UI ────────────────────────────────────────────────── */
function Card({ children, title, subtitle, accent, style }: {
  children: React.ReactNode; title?: string; subtitle?: string; accent?: boolean; style?: React.CSSProperties
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
          <h3 style={{ fontSize: 20, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--tx-0)' }}>{title}</h3>
          {subtitle && <div style={{ fontSize: 11, color: 'var(--tx-2)', marginTop: 4 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

/* ── Mock data ────────────────────────────────────────────────── */
const HOURLY_SALES = [
  { h: '11', v: 120 }, { h: '12', v: 310 }, { h: '13', v: 280 }, { h: '14', v: 140 },
  { h: '15', v: 80 }, { h: '16', v: 110 }, { h: '17', v: 190 }, { h: '18', v: 420 },
  { h: '19', v: 580 }, { h: '20', v: 640 }, { h: '21', v: 490 }, { h: '22', v: 220 },
]

const AGENT_TRAFFIC = [
  { day: '월', direct: 18, agent: 42 },
  { day: '화', direct: 22, agent: 51 },
  { day: '수', direct: 19, agent: 58 },
  { day: '목', direct: 24, agent: 61 },
  { day: '금', direct: 31, agent: 78 },
  { day: '토', direct: 36, agent: 92 },
  { day: '일', direct: 29, agent: 74 },
]

function BigStat({ label, value, delta, accent, sparkline }: {
  label: string; value: string; delta?: string; accent?: boolean; sparkline?: boolean
}) {
  return (
    <Card accent={accent}>
      <div style={{ fontSize: 11, color: 'var(--tx-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, color: accent ? 'var(--or-500)' : 'var(--tx-0)', lineHeight: 1, marginBottom: 6, fontFamily: 'var(--font-display)' }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 11, color: 'var(--gn-500)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
          ↑ {delta}
        </div>
      )}
      {sparkline && (
        <svg width="100%" height="28" viewBox="0 0 100 28" style={{ marginTop: 10, display: 'block' }}>
          <polyline points="0,22 15,18 30,20 45,12 60,15 75,8 90,10 100,4" fill="none" stroke="var(--or-500)" strokeWidth="1.5" />
        </svg>
      )}
    </Card>
  )
}

export default function SalesPage() {
  const maxH = Math.max(...HOURLY_SALES.map(h => h.v))
  const maxT = Math.max(...AGENT_TRAFFIC.map(t => t.agent + t.direct))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <BigStat label="오늘 매출" value="1,248,000원" delta="+18.4%" sparkline />
        <BigStat label="완료 주문" value="47" delta="+12" />
        <BigStat label="평균 객단가" value="26,553원" delta="+4.2%" />
        <BigStat label="AI 주문 비중" value="68%" delta="+23pt" accent />
      </div>

      {/* Hourly sales chart */}
      <Card title="시간대별 매출" subtitle="오늘 11:00 — 22:00">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, padding: '12px 0' }}>
          {HOURLY_SALES.map(h => {
            const isMax = h.v === Math.max(...HOURLY_SALES.map(x => x.v))
            return (
              <div key={h.h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: '100%', height: `${(h.v / maxH) * 140}px`,
                  background: isMax ? 'var(--or-500)' : 'var(--bg-4)',
                  borderRadius: 6,
                  boxShadow: isMax ? '0 0 20px var(--or-glow)' : 'none',
                }} />
                <span style={{ fontSize: 10, color: 'var(--tx-3)', fontFamily: 'var(--font-mono)' }}>{h.h}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* AI vs Direct chart */}
      <Card title="AI vs 직접 주문 비교" subtitle="지난 7일">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 200, padding: '12px 0' }}>
          {AGENT_TRAFFIC.map(t => (
            <div key={t.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--tx-2)', fontFamily: 'var(--font-mono)' }}>{t.agent + t.direct}</div>
              <div style={{ width: '70%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ height: `${(t.agent / maxT) * 140}px`, background: 'var(--or-500)', borderRadius: '6px 6px 0 0' }} />
                <div style={{ height: `${(t.direct / maxT) * 140}px`, background: 'var(--bg-4)', borderRadius: '0 0 6px 6px' }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--tx-3)', fontFamily: 'var(--font-mono)' }}>{t.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--tx-2)' }}>
            <span style={{ width: 10, height: 10, background: 'var(--or-500)', borderRadius: 2 }} />AI 에이전트
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--tx-2)' }}>
            <span style={{ width: 10, height: 10, background: 'var(--bg-4)', borderRadius: 2 }} />직접 주문
          </div>
        </div>
      </Card>
    </div>
  )
}
