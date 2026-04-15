import { getSupabase } from '@/lib/supabase/client'
import { generateSkill } from '@/lib/skill-generator'
import type { Restaurant, MenuItem } from '@/types/database'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function RestaurantDetail({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params

  const [restaurantRes, menuRes] = await Promise.all([
    getSupabase().from('restaurants').select('*').eq('id', restaurantId).single(),
    getSupabase()
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('category')
      .order('name'),
  ])

  if (restaurantRes.error || !restaurantRes.data) {
    notFound()
  }

  const restaurant = restaurantRes.data as Restaurant
  const menuItems = (menuRes.data ?? []) as MenuItem[]

  const mcpServerUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/mcp`
  const { skillMd, skillJson } = generateSkill(restaurant, menuItems, mcpServerUrl)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent mb-6 transition-colors">
        ← 식당 목록
      </Link>

      {/* Restaurant Info */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {restaurant.name}
          </h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              restaurant.is_active
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            {restaurant.is_active ? '영업중' : '휴업'}
          </span>
        </div>
        {restaurant.description && (
          <p className="text-sm text-muted mb-5">{restaurant.description}</p>
        )}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted min-w-[60px]">주소</dt>
            <dd className="text-foreground">{restaurant.address}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted min-w-[60px]">전화</dt>
            <dd className="text-foreground">{restaurant.phone}</dd>
          </div>
          {restaurant.business_hours && (
            <div className="flex gap-2">
              <dt className="text-muted min-w-[60px]">영업시간</dt>
              <dd className="text-foreground">{restaurant.business_hours}</dd>
            </div>
          )}
          {restaurant.category && (
            <div className="flex gap-2">
              <dt className="text-muted min-w-[60px]">카테고리</dt>
              <dd>
                <span className="inline-block rounded-md bg-accent-light text-accent px-2 py-0.5 text-xs font-medium">
                  {restaurant.category}
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Menu */}
      <div className="rounded-xl border border-border bg-surface mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">메뉴</h2>
        </div>
        {menuItems.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted">
            등록된 메뉴가 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">메뉴명</th>
                <th className="px-6 py-3 text-right font-medium text-muted text-xs uppercase tracking-wider">가격</th>
                <th className="px-6 py-3 text-left font-medium text-muted text-xs uppercase tracking-wider">설명</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-accent-light/50 transition-colors">
                  <td className="px-6 py-3.5 text-foreground font-medium">{item.name}</td>
                  <td className="px-6 py-3.5 text-foreground text-right whitespace-nowrap tabular-nums">
                    {item.price.toLocaleString('ko-KR')}원
                  </td>
                  <td className="px-6 py-3.5 text-muted">{item.description ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* AI Skill Install Guide */}
      <div className="rounded-xl border-2 border-accent/20 bg-accent-light/30 p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white text-sm font-bold">AI</span>
          <h2 className="text-lg font-semibold text-foreground">AI Skill 설치 가이드</h2>
        </div>

        <div className="space-y-6">
          {/* Step 1: One-line install */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold">1</span>
              설치 (한 줄)
            </h3>
            <p className="text-sm text-muted mb-2 ml-7">
              터미널에서 아래 명령어를 실행하면 Claude Code에 자동으로 추가됩니다.
            </p>
            <pre className="ml-7 rounded-lg bg-foreground text-stone-300 text-xs p-4 overflow-x-auto">
              <code>{`claude mcp add --transport http mcp-food-platform ${mcpServerUrl}`}</code>
            </pre>
            <p className="text-xs text-muted mt-2 ml-7">
              삭제: <code className="bg-foreground/10 px-1.5 py-0.5 rounded">claude mcp remove mcp-food-platform</code>
            </p>
          </div>

          {/* Step 2: Usage */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold">2</span>
              사용법
            </h3>
            <div className="ml-7 rounded-lg bg-foreground text-stone-300 text-xs p-4 space-y-2">
              <p className="text-stone-500"># Claude Code에서 자연어로 대화하세요</p>
              <p>&quot;{restaurant.name} 메뉴 보여줘&quot;</p>
              <p>&quot;고기만두 2개 주문해줘. 이름 홍길동, 번호 010-1234-5678&quot;</p>
              <p>&quot;주문 상태 확인해줘&quot;</p>
            </div>
          </div>

          {/* Step 3: skill.json (접이식) */}
          <details className="ml-0">
            <summary className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 cursor-pointer">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-300 text-foreground text-[10px] font-bold">3</span>
              skill.json (고급 설정)
            </summary>
            <pre className="ml-7 mt-2 rounded-lg bg-foreground text-stone-300 text-xs p-4 overflow-x-auto max-h-60">
              <code>{JSON.stringify(skillJson, null, 2)}</code>
            </pre>
          </details>

          {/* Step 4: SKILL.md (접이식) */}
          <details className="ml-0">
            <summary className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 cursor-pointer">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-300 text-foreground text-[10px] font-bold">4</span>
              SKILL.md (에이전트 지침서)
            </summary>
            <p className="text-sm text-muted mb-2 ml-7 mt-2">
              AI 에이전트가 이 식당의 메뉴와 주문 방법을 이해하는 지침서입니다.
            </p>
            <pre className="ml-7 rounded-lg bg-foreground text-stone-300 text-xs p-4 overflow-x-auto max-h-72">
              <code>{skillMd}</code>
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}
