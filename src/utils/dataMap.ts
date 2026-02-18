import type { System } from '../types/dataMap'
import sampleData from '../data/sample.json'


// Parse and dedupe sample data by fides_key
export function parseAndDedupeSampleData(): System[] {
  const seen = new Set<string>()
  const data = sampleData as unknown as System[]
  return data.filter((system) => {
    if (seen.has(system.fides_key)) return false
    seen.add(system.fides_key)
    return true
  })
}

// Extract the most nested subcategory from the data_categories path
// (e.g. "user.derived.identifiable.location" -> "location")
// TODO - Verify the scalability of this function. Possible that 'location' can live on other parent paths also
//  if so accuracy will be compromised and confusing
export function extractShortCategory(fullPath: string): string {
  const parts = fullPath.split('.')
  return parts[parts.length - 1] ?? fullPath
}

// Get unique data categories for a system (deduplicated, short names only).
// Flattens across all privacy declarations.
export function getUniqueDataCategories(system: System): string[] {
  const categories = new Set<string>()
  for (const decl of system.privacy_declarations) {
    for (const cat of decl.data_categories) {
      categories.add(extractShortCategory(cat))
    }
  }
  return Array.from(categories).sort()
}

// Get all unique data_use values across systems (for filter options).
export function getUniqueDataUses(systems: System[]): string[] {
  const uses = new Set<string>()
  for (const system of systems) {
    for (const decl of system.privacy_declarations) {
      uses.add(decl.data_use)
    }
  }
  return Array.from(uses).sort()
}

// Get all unique data categories across systems (for filter options).
export function getUniqueDataCategoriesList(systems: System[]): string[] {
  const categories = new Set<string>()
  for (const system of systems) {
    for (const cat of getUniqueDataCategories(system)) {
      categories.add(cat)
    }
  }
  return Array.from(categories).sort()
}

// Filter systems by selected data use(s).
export function filterByDataUse(
  systems: System[],
  selectedUses: string[]
): System[] {
  if (selectedUses.length === 0) return systems
  return systems.filter((system) =>
    system.privacy_declarations.some((decl) =>
      selectedUses.includes(decl.data_use)
    )
  )
}

// Filter systems by selected data category/categories
export function filterByDataCategories(
  systems: System[],
  selectedCategories: string[]
): System[] {
  if (selectedCategories.length === 0) return systems
  return systems.filter((system) => {
    const systemCategories = getUniqueDataCategories(system)
    return selectedCategories.some((cat) => systemCategories.includes(cat))
  })
}

// Apply all filters: data use AND data categories
export function applyFilters(
  systems: System[],
  selectedUses: string[],
  selectedCategories: string[]
): System[] {
  let result = systems
  if (selectedUses.length > 0) {
    result = filterByDataUse(result, selectedUses)
  }
  if (selectedCategories.length > 0) {
    result = filterByDataCategories(result, selectedCategories)
  }
  return result
}

// Group systems by layout mode (system_type or data_use)
// TODO or Intended? - For data_use, a system may appear in multiple groups if it has multiple uses.
export function groupSystems(
  systems: System[],
  layoutMode: 'system_type' | 'data_use'
): Map<string, System[]> {
  const groups = new Map<string, System[]>()
  if (layoutMode === 'system_type') {
    for (const system of systems) {
      const key = system.system_type
      const arr = groups.get(key) ?? []
      arr.push(system)
      groups.set(key, arr)
    }
  } else {
    for (const system of systems) {
      const uses = new Set(
        system.privacy_declarations.map((d) => d.data_use)
      )
      if (uses.size === 0) {
        const key = '(no data use)'
        const arr = groups.get(key) ?? []
        arr.push(system)
        groups.set(key, arr)
      } else {
        for (const use of uses) {
          const arr = groups.get(use) ?? []
          arr.push(system)
          groups.set(use, arr)
        }
      }
    }
  }
  return groups
}
