import { describe, it, expect } from 'vitest'
import { getRelatedCardIds } from './CategoryConnectors'
import type { System } from '../types/dataMap'

const createSystem = (
  fidesKey: string,
  categories: string[][]
): System => ({
  fides_key: fidesKey,
  name: fidesKey,
  description: '',
  system_type: 'Application',
  system_dependencies: [],
  privacy_declarations: categories.map((cats, i) => ({
    data_categories: cats.map((c) => `user.derived.identifiable.${c}`),
    data_subjects: ['customer'],
    data_use: 'advertising',
    name: `Decl ${i}`,
  })),
})

describe('getRelatedCardIds', () => {
  it('includes the hovered card id', () => {
    const systems: System[] = [
      createSystem('a', [['location']]),
      createSystem('b', [['email']]),
    ]
    const result = getRelatedCardIds(systems, 'a')
    expect(result.has('a')).toBe(true)
  })

  it('includes cards that share at least one data category', () => {
    const systems: System[] = [
      createSystem('a', [['location', 'email']]),
      createSystem('b', [['location']]),
      createSystem('c', [['cookie_id']]),
    ]
    const result = getRelatedCardIds(systems, 'a')
    expect(result.has('a')).toBe(true)
    expect(result.has('b')).toBe(true)
    expect(result.has('c')).toBe(false)
  })

  it('returns only hovered card when no other systems share categories', () => {
    const systems: System[] = [
      createSystem('a', [['location']]),
      createSystem('b', [['email']]),
    ]
    const result = getRelatedCardIds(systems, 'a')
    expect(result.size).toBe(1)
    expect(result.has('a')).toBe(true)
  })

  it('returns set containing only hovered id when it is not in systems', () => {
    const systems: System[] = [
      createSystem('a', [['location']]),
    ]
    const result = getRelatedCardIds(systems, 'nonexistent')
    expect(result.size).toBe(1)
    expect(result.has('nonexistent')).toBe(true)
  })
})
