import type { Restaurant, MenuItem } from '@/types/database'
import { generateSkillMd } from './generate-skill-md'
import { generateSkillJson } from './generate-skill-json'

export { generateSkillMd } from './generate-skill-md'
export { generateSkillJson } from './generate-skill-json'

export function generateSkill(
  restaurant: Restaurant,
  menuItems: MenuItem[],
  mcpServerUrl: string,
): { skillMd: string; skillJson: object } {
  const skillMd = generateSkillMd(restaurant, menuItems, mcpServerUrl)
  const skillJson = generateSkillJson(restaurant, mcpServerUrl)

  return { skillMd, skillJson }
}
