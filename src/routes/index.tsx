import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import SystemCard from '../components/SystemCard'
import DataMapFilters from '../components/DataMapFilters'
import CategoryConnectors, {
  getRelatedCardIds,
} from '../components/CategoryConnectors'
import {
  parseAndDedupeSampleData,
  applyFilters,
  groupSystems,
  getUniqueDataUses,
  getUniqueDataCategoriesList,
} from '../utils/dataMap'
import type { LayoutMode } from '../types/dataMap'



const DataMapPage = () => {
  const systems = useMemo(() => parseAndDedupeSampleData(), [])
  const [selectedUses, setSelectedUses] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('system_type')

  // Derived state rather than reqular state
  // Lets useMemo instead of useState because that will cause extra renders and possible sync issues
  const filteredSystems = useMemo(
    () => applyFilters(systems, selectedUses, selectedCategories),
    [systems, selectedUses, selectedCategories]
  )

  const groupedSystems = useMemo(
    () => groupSystems(filteredSystems, layoutMode),
    [filteredSystems, layoutMode]
  )

  const dataUses = useMemo(() => getUniqueDataUses(systems), [systems])

  const dataCategories = useMemo(
    () => getUniqueDataCategoriesList(systems),
    [systems]
  )

  const contentRef = useRef<HTMLDivElement>(null)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)

  const relatedCardIds = useMemo(
    () =>
      hoveredCardId
        ? getRelatedCardIds(filteredSystems, hoveredCardId)
        : new Set<string>(),
    [filteredSystems, hoveredCardId]
  )

  const groupOrder = useMemo(() => {
    const keys = Array.from(groupedSystems.keys())
    if (layoutMode === 'system_type') {
      const order = ['Application', 'Service', 'Database', 'Integration']
      return keys.sort(
        (a, b) => order.indexOf(a) - order.indexOf(b) || a.localeCompare(b)
      )
    }
    return keys.sort()
  }, [groupedSystems, layoutMode])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <main className="max-full-width mx-10 px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Data Map
        </h1>
        <p className="text-slate-400 mb-6">
          Interactive visualization of systems, data categories, and dependencies.
        </p>

        <DataMapFilters
          dataUses={dataUses}
          dataCategories={dataCategories}
          selectedUses={selectedUses}
          selectedCategories={selectedCategories}
          layoutMode={layoutMode}
          onSelectedUsesChange={setSelectedUses}
          onSelectedCategoriesChange={setSelectedCategories}
          onLayoutModeChange={setLayoutMode}
        />

        <div
          ref={contentRef}
          className="relative flex flex-row mt-8 gap-10"
        >
          {layoutMode === 'system_type' && (
            <CategoryConnectors
              systems={filteredSystems}
              hoveredCardId={hoveredCardId}
              containerRef={contentRef}
            />
          )}
          {groupOrder.map((groupKey) => {
            const groupSystemsList = groupedSystems.get(groupKey) ?? []
            if (groupSystemsList.length === 0) return null

            return (
              <section key={groupKey} className="relative z-[5]">
                <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 rounded bg-cyan-500" />
                  {groupKey}
                </h2>
                <div className="grid grid-cols-1 gap-4 space-y-10">
                  {groupSystemsList.map((system) => {
                    const isDimmed =
                      layoutMode === 'system_type' &&
                      hoveredCardId !== null &&
                      !relatedCardIds.has(system.fides_key)
                    return (
                      <div
                        key={`${groupKey}-${system.fides_key}`}
                        data-fides-key={system.fides_key}
                        onMouseEnter={() =>
                          setHoveredCardId(system.fides_key)
                        }
                        onMouseLeave={() => setHoveredCardId(null)}
                        className={`transition-opacity duration-300 ease-out z-10 ${
                          isDimmed ? 'opacity-20' : 'opacity-100'
                        }`}
                      >
                        <SystemCard system={system} />
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {filteredSystems.length === 0 && (
          <p className="text-slate-400 text-center py-12">
            No systems match the current filters. Try adjusting your selection.
          </p>
        )}
      </main>
    </div>
  )
}
export default DataMapPage;

export const Route = createFileRoute('/')({ component: DataMapPage })
