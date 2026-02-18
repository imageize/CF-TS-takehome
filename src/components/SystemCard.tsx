import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { System } from '../types/dataMap'
import { getUniqueDataCategories } from '../utils/dataMap'

interface SystemCardProps {
  system: System
}

function getUniqueDataUses(system: System): string[] {
  const uses = new Set<string>()
  for (const decl of system.privacy_declarations) {
    uses.add(decl.name)
  }
  return Array.from(uses).sort()
}


// TODO - Tailwind Pruning: Probably better as ENUM with color values.
// Friendlier for Tailwind
const SYSTEM_TYPE_COLORS: Record<string, string> = {
  Application: 'border-teal-500/60 bg-teal-500/10',
  Service: 'border-amber-500/60 bg-amber-500/10',
  Database: 'border-purple-500/60 bg-purple-500/10',
  Integration: 'border-sky-500/60 bg-sky-500/10',
}

const DEFAULT_COLOR = 'border-slate-600 bg-slate-800/50'


export default function SystemCard({ system }: SystemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const categories = getUniqueDataCategories(system)
  const dataUses = getUniqueDataUses(system)

  // TODO - Tailwind Pruning: Use ClassNames package to prevent pruning issue with Tailwind.
  const colorClass = SYSTEM_TYPE_COLORS[system.system_type] ?? DEFAULT_COLOR

  return (
    <article className={`rounded-lg border p-4 ${colorClass}`}>
      <h3 className="font-semibold text-white text-base">
        {system.name}
      </h3>
      {categories.length > 0 && (
        <>
        <span className="text-xs text-slate-500 font-medium">Catgories:</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <span
              key={`${system.fides_key}-${cat}`}
              className="px-2 py-0.5 rounded text-xs bg-slate-700/60 text-slate-300"
            >
              {cat}
            </span>
          ))}
        </div>
        </>
      )}
      {dataUses.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-slate-500 font-medium">Data use:</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {dataUses.map((use) => (
              <span
                key={`${system.fides_key}-${use}`}
                className="px-2 py-0.5 rounded text-xs bg-slate-700/60 text-slate-400"
              >
                {use}
              </span>
            ))}
          </div>
        </div>
      )}
      {system.description && (
        <div className="mt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
            <span>{isExpanded ? 'Hide' : 'Show'} description</span>
          </button>
          <div
            className={`
              grid transition-[grid-template-rows] duration-300 ease-in-out
              ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
            `}
          >
            <div className="overflow-hidden">
              <p className="mt-2 text-sm text-slate-400 leading-relaxed pt-2 border-t border-slate-600/50">
                {system.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
