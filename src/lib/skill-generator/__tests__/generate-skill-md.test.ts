import { generateSkillMd } from '../generate-skill-md'
import type { Restaurant, MenuItem } from '@/types/database'

const mockRestaurant: Restaurant = {
  id: 'rest-001',
  name: '맛있는 김치찌개',
  description: '정통 한식 김치찌개 전문점',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '02-1234-5678',
  business_hours: '매일 11:00 - 21:00',
  category: '한식',
  image_url: 'https://example.com/image.jpg',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
}

const mockMenuItems: MenuItem[] = [
  {
    id: 'menu-001',
    restaurant_id: 'rest-001',
    name: '김치찌개',
    description: '돼지고기 김치찌개',
    price: 9000,
    category: '찌개',
    is_available: true,
    image_url: null,
    options: null,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'menu-002',
    restaurant_id: 'rest-001',
    name: '된장찌개',
    description: null,
    price: 8500,
    category: '찌개',
    is_available: true,
    image_url: null,
    options: null,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'menu-003',
    restaurant_id: 'rest-001',
    name: '제육볶음',
    description: '매콤한 제육볶음 정식',
    price: 12000,
    category: '볶음',
    is_available: true,
    image_url: null,
    options: null,
    created_at: '2025-01-01T00:00:00Z',
  },
]

const mcpUrl = 'https://mcp.example.com/sse'

describe('generateSkillMd', () => {
  it('generates valid SKILL.md with YAML frontmatter for a complete restaurant', () => {
    const result = generateSkillMd(mockRestaurant, mockMenuItems, mcpUrl)

    // YAML frontmatter
    expect(result).toMatch(/^---\n/)
    expect(result).toContain('name: 맛있는 김치찌개')
    expect(result).toContain('description: 맛있는 김치찌개의 AI 주문 에이전트')
    expect(result).toContain('version: 1.0.0')
    expect(result).toContain('- 한식')

    // Restaurant info
    expect(result).toContain('# 맛있는 김치찌개')
    expect(result).toContain('정통 한식 김치찌개 전문점')
    expect(result).toContain('서울특별시 강남구 테헤란로 123')
    expect(result).toContain('02-1234-5678')
    expect(result).toContain('매일 11:00 - 21:00')
  })

  it('handles missing optional fields (description, category, business_hours)', () => {
    const minimal: Restaurant = {
      ...mockRestaurant,
      description: null,
      category: null,
      business_hours: null,
    }

    const result = generateSkillMd(minimal, mockMenuItems, mcpUrl)

    // Falls back to defaults
    expect(result).toContain('- 카테고리: 음식점')
    expect(result).toContain('- 영업시간: 정보 없음')
    expect(result).toContain(`${minimal.name} 음식 주문 서비스`)
  })

  it('handles empty menu items array', () => {
    const result = generateSkillMd(mockRestaurant, [], mcpUrl)

    expect(result).toContain('등록된 메뉴가 없습니다')
  })

  it('formats prices correctly in Korean won', () => {
    const result = generateSkillMd(mockRestaurant, mockMenuItems, mcpUrl)

    // 9000 -> 9,000원, 8500 -> 8,500원, 12000 -> 12,000원
    expect(result).toContain('9,000원')
    expect(result).toContain('8,500원')
    expect(result).toContain('12,000원')
  })

  it('contains all required sections', () => {
    const result = generateSkillMd(mockRestaurant, mockMenuItems, mcpUrl)

    expect(result).toContain('## 기본 정보')
    expect(result).toContain('## 메뉴')
    expect(result).toContain('## 주문 방법')
    expect(result).toContain('## 에이전트 지침')
  })

  it('renders menu items as a markdown table', () => {
    const result = generateSkillMd(mockRestaurant, mockMenuItems, mcpUrl)

    expect(result).toContain('| 메뉴명 | 가격 | 설명 |')
    expect(result).toContain('| 김치찌개 | 9,000원 | 돼지고기 김치찌개 |')
    // null description falls back to '-'
    expect(result).toContain('| 된장찌개 | 8,500원 | - |')
    expect(result).toContain('| 제육볶음 | 12,000원 | 매콤한 제육볶음 정식 |')
  })
})
