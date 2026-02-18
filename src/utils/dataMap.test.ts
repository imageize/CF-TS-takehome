import { describe, it, expect } from 'vitest'
import {
  parseAndDedupeSampleData,
  extractShortCategory,
  getUniqueDataCategories,
  getUniqueDataUses,
  getUniqueDataCategoriesList,
  filterByDataUse,
  filterByDataCategories,
  applyFilters,
  groupSystems,
} from './dataMap'
import type { System } from '../types/dataMap'

describe('extractShortCategory', () => {
  it('returns the last segment of a dotted path', () => {
    expect(extractShortCategory('user.derived.identifiable.location')).toBe(
      'location'
    )
  })

  it('returns single segment unchanged', () => {
    expect(extractShortCategory('email')).toBe('email')
  })

  it('returns full path when empty segments', () => {
    expect(extractShortCategory('')).toBe('')
  })
})

describe('parseAndDedupeSampleData', () => {
  it('deduplicates systems by fides_key', () => {
    const result = parseAndDedupeSampleData()
    const keys = result.map((s) => s.fides_key)
    expect(keys).toHaveLength(new Set(keys).size)
  })

  it('returns an array of systems', () => {
    const result = parseAndDedupeSampleData()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('fides_key')
    expect(result[0]).toHaveProperty('name')
    expect(result[0]).toHaveProperty('system_type')
    expect(result[0]).toHaveProperty('privacy_declarations')
  })
})

describe('getUniqueDataCategories', () => {
  it('extracts and deduplicates short category names from a system', () => {
    const system: System = {
      fides_key: 'test',
      name: 'Test',
      description: '',
      system_type: 'Application',
      system_dependencies: [],
      privacy_declarations: [
        {
          data_categories: ['user.derived.identifiable.location'],
          data_subjects: ['customer'],
          data_use: 'advertising',
          name: 'Ad',
        },
        {
          data_categories: [
            'user.provided.identifiable.contact.email',
            'user.derived.identifiable.location',
          ],
          data_subjects: ['customer'],
          data_use: 'marketing',
          name: 'Marketing',
        },
      ],
    }
    const result = getUniqueDataCategories(system)
    expect(result).toContain('location')
    expect(result).toContain('email')
    expect(result).toHaveLength(2)
    expect(result).toEqual([...result].sort())
  })

  it('returns empty array for system with no declarations', () => {
    const system: System = {
      fides_key: 'test',
      name: 'Test',
      description: '',
      system_type: 'Application',
      system_dependencies: [],
      privacy_declarations: [],
    }
    expect(getUniqueDataCategories(system)).toEqual([])
  })
})

describe('getUniqueDataUses', () => {
  it('collects unique data_use values across systems', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          { data_categories: [], data_subjects: [], data_use: 'advertising', name: 'Ad' },
        ],
      },
      {
        fides_key: 'b',
        name: 'B',
        description: '',
        system_type: 'Service',
        system_dependencies: [],
        privacy_declarations: [
          { data_categories: [], data_subjects: [], data_use: 'advertising', name: 'Ad' },
          { data_categories: [], data_subjects: [], data_use: 'analytics', name: 'Analytics' },
        ],
      },
    ]
    const result = getUniqueDataUses(systems)
    expect(result).toContain('advertising')
    expect(result).toContain('analytics')
    expect(result).toHaveLength(2)
    expect(result).toEqual([...result].sort())
  })
})

describe('getUniqueDataCategoriesList', () => {
  it('collects unique categories across all systems', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          {
            data_categories: ['user.derived.identifiable.location'],
            data_subjects: [],
            data_use: 'x',
            name: 'X',
          },
        ],
      },
      {
        fides_key: 'b',
        name: 'B',
        description: '',
        system_type: 'Service',
        system_dependencies: [],
        privacy_declarations: [
          {
            data_categories: ['user.provided.identifiable.contact.email'],
            data_subjects: [],
            data_use: 'y',
            name: 'Y',
          },
        ],
      },
    ]
    const result = getUniqueDataCategoriesList(systems)
    expect(result).toContain('location')
    expect(result).toContain('email')
    expect(result).toEqual([...result].sort())
  })
})

describe('filterByDataUse', () => {
  it('returns all systems when no uses selected', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          { data_categories: [], data_subjects: [], data_use: 'advertising', name: 'Ad' },
        ],
      },
    ]
    expect(filterByDataUse(systems, [])).toEqual(systems)
  })

  it('filters systems by selected data use', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          { data_categories: [], data_subjects: [], data_use: 'advertising', name: 'Ad' },
        ],
      },
      {
        fides_key: 'b',
        name: 'B',
        description: '',
        system_type: 'Service',
        system_dependencies: [],
        privacy_declarations: [
          { data_categories: [], data_subjects: [], data_use: 'analytics', name: 'Analytics' },
        ],
      },
    ]
    const result = filterByDataUse(systems, ['advertising'])
    expect(result).toHaveLength(1)
    expect(result[0].fides_key).toBe('a')
  })
})

describe('filterByDataCategories', () => {
  it('returns all systems when no categories selected', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          {
            data_categories: ['user.derived.identifiable.location'],
            data_subjects: [],
            data_use: 'x',
            name: 'X',
          },
        ],
      },
    ]
    expect(filterByDataCategories(systems, [])).toEqual(systems)
  })

  it('filters systems by selected data category', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          {
            data_categories: ['user.derived.identifiable.location'],
            data_subjects: [],
            data_use: 'x',
            name: 'X',
          },
        ],
      },
      {
        fides_key: 'b',
        name: 'B',
        description: '',
        system_type: 'Service',
        system_dependencies: [],
        privacy_declarations: [
          {
            data_categories: ['user.provided.identifiable.contact.email'],
            data_subjects: [],
            data_use: 'y',
            name: 'Y',
          },
        ],
      },
    ]
    const result = filterByDataCategories(systems, ['location'])
    expect(result).toHaveLength(1)
    expect(result[0].fides_key).toBe('a')
  })
})

describe('applyFilters', () => {
  it('applies both data use and category filters', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          {
            data_categories: ['user.derived.identifiable.location'],
            data_subjects: [],
            data_use: 'advertising',
            name: 'Ad',
          },
        ],
      },
      {
        fides_key: 'b',
        name: 'B',
        description: '',
        system_type: 'Service',
        system_dependencies: [],
        privacy_declarations: [
          {
            data_categories: ['user.provided.identifiable.contact.email'],
            data_subjects: [],
            data_use: 'analytics',
            name: 'Analytics',
          },
        ],
      },
    ]
    const result = applyFilters(systems, ['advertising'], ['location'])
    expect(result).toHaveLength(1)
    expect(result[0].fides_key).toBe('a')
  })

  it('returns all systems when no filters selected', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [],
      },
    ]
    expect(applyFilters(systems, [], [])).toEqual(systems)
  })
})

describe('groupSystems', () => {
  it('groups by system_type when layout mode is system_type', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [],
      },
      {
        fides_key: 'b',
        name: 'B',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [],
      },
      {
        fides_key: 'c',
        name: 'C',
        description: '',
        system_type: 'Database',
        system_dependencies: [],
        privacy_declarations: [],
      },
    ]
    const result = groupSystems(systems, 'system_type')
    expect(result.get('Application')).toHaveLength(2)
    expect(result.get('Database')).toHaveLength(1)
  })

  it('groups by data_use when layout mode is data_use', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [
          { data_categories: [], data_subjects: [], data_use: 'advertising', name: 'Ad' },
          { data_categories: [], data_subjects: [], data_use: 'analytics', name: 'Analytics' },
        ],
      },
    ]
    const result = groupSystems(systems, 'data_use')
    expect(result.get('advertising')).toHaveLength(1)
    expect(result.get('analytics')).toHaveLength(1)
  })

  it('puts systems with no data use in (no data use) group', () => {
    const systems: System[] = [
      {
        fides_key: 'a',
        name: 'A',
        description: '',
        system_type: 'Application',
        system_dependencies: [],
        privacy_declarations: [],
      },
    ]
    const result = groupSystems(systems, 'data_use')
    expect(result.get('(no data use)')).toHaveLength(1)
  })
})
