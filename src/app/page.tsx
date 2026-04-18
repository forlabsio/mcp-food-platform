import { getSupabase } from '@/lib/supabase/client'
import type { Restaurant } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function RegistryHome() {
  let list: Restaurant[] = []
  let error: string | null = null

  try {
    const result = await getSupabase()
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })

    if (result.error) error = result.error.message
    else list = (result.data ?? []) as Restaurant[]
  } catch {
    error = '데이터를 불러오는 중 오류가 발생했습니다.'
  }

  return (
    <div>
      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '40px 0 40px',
      }}>
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--or-glow) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999,
            background: 'rgba(255,138,61,0.14)', border: '1px solid rgba(255,138,61,0.3)',
            fontSize: 11, fontWeight: 500, color: 'var(--or-500)',
            marginBottom: 16,
          }}>
            ✦ MCP Skill Marketplace
          </div>
          <h1 style={{
            fontSize: 36, fontFamily: 'var(--font-display)',
            lineHeight: 1.2, margin: '0 0 16px', color: 'var(--tx-0)',
          }}>
            AI 에이전트로 주문하는<br />새로운 방식
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--tx-2)', lineHeight: 1.6,
            maxWidth: 480, margin: 0,
          }}>
            식당의 AI Skill을 설치하면 Claude, ChatGPT 등
            AI 에이전트에서 바로 메뉴 조회와 주문이 가능합니다.
            배달앱 수수료 없이, 직접 연결.
          </p>
        </div>
      </section>

      {/* Restaurant List */}
      <section style={{ padding: '0 0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', margin: 0, color: 'var(--tx-0)' }}>
            등록된 식당
            {list.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--tx-3)', fontWeight: 400 }}>{list.length}곳</span>
            )}
          </h2>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(226,86,62,0.1)', border: '1px solid rgba(226,86,62,0.3)',
            fontSize: 12, color: 'var(--rd-500)', marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {list.length === 0 && !error && (
          <div style={{
            padding: 60, textAlign: 'center',
            background: 'var(--bg-1)', border: '2px dashed var(--line-2)', borderRadius: 16,
          }}>
            <div style={{ fontSize: 13, color: 'var(--tx-3)', marginBottom: 4 }}>등록된 식당이 없습니다</div>
            <div style={{ fontSize: 11, color: 'var(--tx-3)' }}>
              관리자 메뉴에서 식당을 추가하거나 Supabase에 데이터를 삽입하세요
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {list.map(restaurant => (
            <a
              key={restaurant.id}
              href={`/${restaurant.id}`}
              style={{
                display: 'block', textDecoration: 'none',
                background: 'var(--bg-1)', border: '1px solid var(--line)',
                borderRadius: 16, padding: 20,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15, margin: 0, color: 'var(--tx-0)', fontWeight: 500 }}>
                  {restaurant.name}
                </h3>
                <span style={{
                  padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 500,
                  background: restaurant.is_active ? 'rgba(111,191,115,0.14)' : 'var(--bg-3)',
                  color: restaurant.is_active ? 'var(--gn-500)' : 'var(--tx-3)',
                  border: `1px solid ${restaurant.is_active ? 'rgba(111,191,115,0.3)' : 'var(--line-2)'}`,
                }}>
                  {restaurant.is_active ? '영업중' : '휴업'}
                </span>
              </div>
              {restaurant.category && (
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                  background: 'rgba(255,138,61,0.14)', color: 'var(--or-500)',
                  fontSize: 10, fontWeight: 500, marginBottom: 10,
                  border: '1px solid rgba(255,138,61,0.2)',
                }}>
                  {restaurant.category}
                </span>
              )}
              <p style={{ fontSize: 12, color: 'var(--tx-2)', margin: '4px 0 0' }}>
                {restaurant.address}
              </p>
              {restaurant.description && (
                <p style={{ fontSize: 11, color: 'var(--tx-3)', margin: '6px 0 0', lineHeight: 1.5 }}>
                  {restaurant.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
