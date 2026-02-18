import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataMapPage from '../routes/index'

describe('DataMapPage integration', () => {
  it('renders Data Map heading', () => {
    render(<DataMapPage />)
    expect(screen.getByRole('heading', { name: 'Data Map' })).toBeInTheDocument()
  })

  it('renders system cards grouped by system type by default', () => {
    render(<DataMapPage />)
    expect(screen.getByRole('heading', { name: 'Application' })).toBeInTheDocument()
  })

  it('filters systems when data use is selected', async () => {
    const user = userEvent.setup()
    render(<DataMapPage />)
    const dataUseButton = screen.getByRole('button', { name: /all data uses/i })
    await user.click(dataUseButton)
    const advertisingCheckbox = screen.getByRole('checkbox', { name: /advertising\.third_party/i })
    await user.click(advertisingCheckbox)
    await user.click(document.body)
    expect(screen.getByText(/selected/i)).toBeInTheDocument()
  })

  it('switches to Data Use layout when Data Use button is clicked', async () => {
    const user = userEvent.setup()
    render(<DataMapPage />)
    await user.click(screen.getByRole('button', { name: 'Data Use' }))
    const dataUseHeadings = screen.getAllByRole('heading').filter(
      (h) => /advertising|provide|improve/i.test(h.textContent ?? '')
    )
    expect(dataUseHeadings.length).toBeGreaterThan(0)
  })

  it('displays system names from sample data', () => {
    render(<DataMapPage />)
    expect(screen.getByText('Example.com Online Storefront')).toBeInTheDocument()
  })
})
