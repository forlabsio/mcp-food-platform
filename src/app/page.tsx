import Link from 'next/link'
import { getSupabase } from '@/lib/supabase/client'
import type { Restaurant } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function RegistryHome() {
  const { data: restaurants, error } = await getSupabase()
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  const list = (restaurants ?? []) as Restaurant[]

  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-surface">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-3">
            MCP Skill Marketplace
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            AI 에이전트로 주문하는<br />새로운 방식
          </h1>
          <p className="text-stone-400 text-base max-w-lg leading-relaxed">
            식당의 AI Skill을 설치하면 Claude, ChatGPT 등
            AI 에이전트에서 바로 메뉴 조회와 주문이 가능합니다.
            배달앱 수수료 없이, 직접 연결.
          </p>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            등록된 식당
            {list.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted">{list.length}곳</span>
            )}
          </h2>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 mb-6 text-sm text-red-700">
            데이터를 불러오는 중 오류가 발생했습니다: {error.message}
          </div>
        )}

        {list.length === 0 && !error && (
          <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
            <p className="text-muted text-sm mb-1">등록된 식당이 없습니다</p>
            <p className="text-muted text-xs">
              관리자 메뉴에서 식당을 추가하거나 Supabase에 데이터를 삽입하세요
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/${restaurant.id}`}
              className="group block rounded-xl border border-border bg-surface p-5 hover:border-accent/40 hover:shadow-md hover:shadow-accent/5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                  {restaurant.name}
                </h3>
                <span
                  className={`shrink-0 ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    restaurant.is_active
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {restaurant.is_active ? '영업중' : '휴업'}
                </span>
              </div>
              {restaurant.category && (
                <span className="inline-block rounded-md bg-accent-light text-accent px-2 py-0.5 text-xs font-medium mb-3">
                  {restaurant.category}
                </span>
              )}
              <p className="text-sm text-muted truncate">
                {restaurant.address}
              </p>
              {restaurant.description && (
                <p className="text-sm text-muted mt-1 line-clamp-2">
                  {restaurant.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
