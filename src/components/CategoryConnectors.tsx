import { useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { System } from '../types/dataMap'
import { getUniqueDataCategories } from '../utils/dataMap'

type Connection = { from: string; to: string }

interface CategoryConnectorsProps {
  systems: System[]
  hoveredCardId: string | null
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function getRelatedCardIds(
  systems: System[],
  hoveredId: string
): Set<string> {
  const conns = getConnectionsForHovered(systems, hoveredId)
  const related = new Set<string>([hoveredId])
  for (const { from, to } of conns) {
    related.add(from)
    related.add(to)
  }
  return related
}

function getConnectionsForHovered(
  systems: System[],
  hoveredId: string
): Connection[] {
  const systemMap = new Map(systems.map((s) => [s.fides_key, s]))
  const hovered = systemMap.get(hoveredId)
  if (!hovered) return []

  const categoriesX = new Set(getUniqueDataCategories(hovered))
  const conns: Connection[] = []
  const seen = new Set<string>()

  for (const system of systems) {
    if (system.fides_key === hoveredId) continue
    const categoriesY = new Set(getUniqueDataCategories(system))
    const shared = [...categoriesX].some((c) => categoriesY.has(c))
    if (shared) {
      const key = [hoveredId, system.fides_key].sort().join('--')
      if (!seen.has(key)) {
        seen.add(key)
        conns.push({ from: hoveredId, to: system.fides_key })
      }
    }
  }
  return conns
}

export default function CategoryConnectors({
  systems,
  hoveredCardId,
  containerRef,
}: CategoryConnectorsProps) {
  const [paths, setPaths] = useState<Array<{ d: string; from: string; to: string }>>([])

  const connections = useMemo(
    () =>
      hoveredCardId ? getConnectionsForHovered(systems, hoveredCardId) : [],
    [systems, hoveredCardId]
  )

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || connections.length === 0) {
      setPaths([])
      return
    }

    const measure = () => {
      const elements = document.querySelectorAll<HTMLElement>('[data-fides-key]')

      const positions = new Map<string, DOMRect>()
      for (const el of elements) {
        const key = el.getAttribute('data-fides-key')
        if (key && !positions.has(key)) {
          positions.set(key, el.getBoundingClientRect())
        }
      }

      const computed: Array<{ d: string; from: string; to: string }> = []
      for (const { from, to } of connections) {
        const fromRect = positions.get(from)
        const toRect = positions.get(to)
        if (!fromRect || !toRect) continue

        const fromX = fromRect.left + fromRect.width / 2
        const fromY = fromRect.bottom
        const toX = toRect.left + toRect.width / 2
        const toY = toRect.top

        const midY = (fromY + toY) / 2
        const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`
        computed.push({ d, from, to })
      }
      setPaths(computed)
    }

    measure()
    const raf = requestAnimationFrame(() => measure())
    return () => cancelAnimationFrame(raf)
  }, [connections, containerRef])

  if (connections.length === 0) return null

  const svg = (
    <svg
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
      style={{ left: 0, top: 0, width: '100vw', height: '100vh' }}
    >
      {paths.map(({ d, from, to }) => (
        <path
          key={`${from}-${to}`}
          d={d}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={3}
          strokeDasharray="8 4"
          opacity={0.9}
          style={{ transition: 'opacity 0.25s ease-out' }}
        />
      ))}
    </svg>
  )

  return createPortal(svg, document.body)
}
