import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { LayoutMode } from '../types/dataMap'

interface DataMapFiltersProps {
  dataUses: string[]
  dataCategories: string[]
  selectedUses: string[]
  selectedCategories: string[]
  layoutMode: LayoutMode
  onSelectedUsesChange: (uses: string[]) => void
  onSelectedCategoriesChange: (categories: string[]) => void
  onLayoutModeChange: (mode: LayoutMode) => void
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close the dropdown when the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Change the selected values
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-[200px] px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 hover:border-slate-500 transition-colors"
      >
        <span className="truncate">
          {selected.length === 0
            ? placeholder
            : `${selected.length} selected`}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 shadow-xl max-h-60 overflow-y-auto">
          {options.map((opt) => (
            //I Prefer not to use an index as the key
            <label
              key={`${label}-${opt}`}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="rounded border-slate-500"
              />
              <span className="text-sm text-slate-200 truncate" title={opt}>
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DataMapFilters({
  dataUses,
  dataCategories,
  selectedUses,
  selectedCategories,
  layoutMode,
  onSelectedUsesChange,
  onSelectedCategoriesChange,
  onLayoutModeChange,
}: DataMapFiltersProps) {
  const clearFilters = () => {
    onSelectedUsesChange([])
    onSelectedCategoriesChange([])
  }

  const hasActiveFilters = selectedUses.length > 0 || selectedCategories.length > 0

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
      <MultiSelect
        label="Filter by Data Use"
        options={dataUses}
        selected={selectedUses}
        onChange={onSelectedUsesChange}
        placeholder="All data uses"
      />
      <MultiSelect
        label="Filter by Data Categories"
        options={dataCategories}
        selected={selectedCategories}
        onChange={onSelectedCategoriesChange}
        placeholder="All categories"
      />

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Group by
        </label>
        <div className="flex rounded-lg overflow-hidden border border-slate-600">
          <button
            type="button"
            onClick={() => onLayoutModeChange('system_type')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              layoutMode === 'system_type'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            System Type
          </button>
          <button
            type="button"
            onClick={() => onLayoutModeChange('data_use')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              layoutMode === 'data_use'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Data Use
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
