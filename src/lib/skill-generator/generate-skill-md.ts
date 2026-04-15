import type { Restaurant, MenuItem } from '@/types/database'

export function generateSkillMd(
  restaurant: Restaurant,
  menuItems: MenuItem[],
  mcpServerUrl: string,
): string {
  const category = restaurant.category ?? '음식점'
  const description = restaurant.description ?? `${restaurant.name} 음식 주문 서비스`
  const address = restaurant.address || '정보 없음'
  const phone = restaurant.phone || '정보 없음'
  const businessHours = restaurant.business_hours ?? '정보 없음'

  const menuTable = menuItems.length > 0
    ? menuItems
        .map((item) => {
          const itemDesc = item.description ?? '-'
          const formattedPrice = item.price.toLocaleString('ko-KR')
          return `| ${item.name} | ${formattedPrice}원 | ${itemDesc} |`
        })
        .join('\n')
    : '| - | - | 등록된 메뉴가 없습니다 |'

  return `---
name: ${restaurant.name}
description: ${restaurant.name}의 AI 주문 에이전트
version: 1.0.0
keywords:
  - 음식주문
  - ${category}
  - ${restaurant.name}
  - 배달
  - 맛집
---

# ${restaurant.name}

${description}

## 기본 정보
- 주소: ${address}
- 전화: ${phone}
- 영업시간: ${businessHours}
- 카테고리: ${category}

## 메뉴

| 메뉴명 | 가격 | 설명 |
|--------|------|------|
${menuTable}

## 주문 방법

이 Skill이 설치되면 다음과 같이 주문할 수 있습니다:
1. "메뉴 보여줘" — 전체 메뉴를 조회합니다
2. "{메뉴명} {수량}개 주문해줘" — 주문을 생성합니다
3. "주문 상태 확인해줘" — 주문 진행 상황을 확인합니다

## 에이전트 지침

- 고객에게 친근하고 정확하게 응답해주세요
- 메뉴에 없는 항목은 주문할 수 없습니다
- 주문 전 반드시 고객명과 연락처를 확인하세요
- 가격 정보는 정확하게 안내해주세요. 임의로 가격을 만들지 마세요.
`
}
