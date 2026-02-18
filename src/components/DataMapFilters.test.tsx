import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataMapFilters from './DataMapFilters'

describe('DataMapFilters', () => {
  const defaultProps = {
    dataUses: ['advertising', 'analytics', 'provide.system'],
    dataCategories: ['location', 'email', 'cookie_id'],
    selectedUses: [] as string[],
    selectedCategories: [] as string[],
    layoutMode: 'system_type' as const,
    onSelectedUsesChange: vi.fn(),
    onSelectedCategoriesChange: vi.fn(),
    onLayoutModeChange: vi.fn(),
  }

  it('renders filter by data use label', () => {
    render(<DataMapFilters {...defaultProps} />)
    expect(screen.getByText('Filter by Data Use')).toBeInTheDocument()
  })

  it('renders filter by data categories label', () => {
    render(<DataMapFilters {...defaultProps} />)
    expect(screen.getByText('Filter by Data Categories')).toBeInTheDocument()
  })

  it('renders group by label', () => {
    render(<DataMapFilters {...defaultProps} />)
    expect(screen.getByText('Group by')).toBeInTheDocument()
  })

  it('renders System Type and Data Use layout buttons', () => {
    render(<DataMapFilters {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'System Type' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Data Use' })).toBeInTheDocument()
  })

  it('calls onLayoutModeChange when Data Use button is clicked', async () => {
    const user = userEvent.setup()
    const onLayoutModeChange = vi.fn()
    render(
      <DataMapFilters
        {...defaultProps}
        onLayoutModeChange={onLayoutModeChange}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Data Use' }))
    expect(onLayoutModeChange).toHaveBeenCalledWith('data_use')
  })

  it('calls onLayoutModeChange when System Type button is clicked', async () => {
    const user = userEvent.setup()
    const onLayoutModeChange = vi.fn()
    render(
      <DataMapFilters
        {...defaultProps}
        layoutMode="data_use"
        onLayoutModeChange={onLayoutModeChange}
      />
    )
    await user.click(screen.getByRole('button', { name: 'System Type' }))
    expect(onLayoutModeChange).toHaveBeenCalledWith('system_type')
  })

  it('shows Clear filters button when filters are active', () => {
    render(
      <DataMapFilters
        {...defaultProps}
        selectedUses={['advertising']}
      />
    )
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('does not show Clear filters button when no filters are active', () => {
    render(<DataMapFilters {...defaultProps} />)
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('calls both clear callbacks when Clear filters is clicked', async () => {
    const user = userEvent.setup()
    const onSelectedUsesChange = vi.fn()
    const onSelectedCategoriesChange = vi.fn()
    render(
      <DataMapFilters
        {...defaultProps}
        selectedUses={['advertising']}
        onSelectedUsesChange={onSelectedUsesChange}
        onSelectedCategoriesChange={onSelectedCategoriesChange}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onSelectedUsesChange).toHaveBeenCalledWith([])
    expect(onSelectedCategoriesChange).toHaveBeenCalledWith([])
  })

  it('opens data use dropdown and allows selecting an option', async () => {
    const user = userEvent.setup()
    const onSelectedUsesChange = vi.fn()
    render(
      <DataMapFilters
        {...defaultProps}
        onSelectedUsesChange={onSelectedUsesChange}
      />
    )
    const filterButton = screen.getByRole('button', { name: /all data uses/i })
    await user.click(filterButton)
    const advertisingOption = screen.getByRole('checkbox', { name: /advertising/i })
    expect(advertisingOption).toBeInTheDocument()
    await user.click(advertisingOption)
    expect(onSelectedUsesChange).toHaveBeenCalled()
  })
})
