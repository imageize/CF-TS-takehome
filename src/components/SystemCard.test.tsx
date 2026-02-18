import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SystemCard from './SystemCard'
import type { System } from '../types/dataMap'

const mockSystemWithDescription: System = {
  fides_key: 'test_system',
  name: 'Test System',
  description: 'This is a test system description.',
  system_type: 'Application',
  system_dependencies: [],
  privacy_declarations: [
    {
      data_categories: ['user.derived.identifiable.location'],
      data_subjects: ['customer'],
      data_use: 'advertising',
      name: 'Online Advertising',
    },
  ],
}

const mockSystemMinimal: System = {
  fides_key: 'minimal',
  name: 'Minimal System',
  description: '',
  system_type: 'Service',
  system_dependencies: [],
  privacy_declarations: [],
}

describe('SystemCard', () => {
  it('renders system name', () => {
    render(<SystemCard system={mockSystemWithDescription} />)
    expect(screen.getByText('Test System')).toBeInTheDocument()
  })

  it('renders data categories when present', () => {
    render(<SystemCard system={mockSystemWithDescription} />)
    expect(screen.getByText('location')).toBeInTheDocument()
  })

  it('renders data use names when present', () => {
    render(<SystemCard system={mockSystemWithDescription} />)
    expect(screen.getByText('Online Advertising')).toBeInTheDocument()
  })

  it('does not render categories section when system has none', () => {
    render(<SystemCard system={mockSystemMinimal} />)
    expect(screen.queryByText(/Catgories:/i)).not.toBeInTheDocument()
  })

  it('does not render data use section when system has none', () => {
    render(<SystemCard system={mockSystemMinimal} />)
    expect(screen.queryByText(/Data use:/i)).not.toBeInTheDocument()
  })

  it('does not render description toggle when system has no description', () => {
    render(<SystemCard system={mockSystemMinimal} />)
    expect(screen.queryByRole('button', { name: /show description/i })).not.toBeInTheDocument()
  })

  it('expands description when Show description is clicked', async () => {
    const user = userEvent.setup()
    render(<SystemCard system={mockSystemWithDescription} />)
    await user.click(screen.getByRole('button', { name: /show description/i }))
    expect(screen.getByText('This is a test system description.')).toBeVisible()
  })

  it('collapses description when Hide description is clicked', async () => {
    const user = userEvent.setup()
    render(<SystemCard system={mockSystemWithDescription} />)
    await user.click(screen.getByRole('button', { name: /show description/i }))
    expect(screen.getByText('This is a test system description.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: /hide description/i }))
    expect(screen.getByText('This is a test system description.')).toBeInTheDocument()
  })

  it('renders as an article', () => {
    render(<SystemCard system={mockSystemWithDescription} />)
    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
    expect(article).toHaveTextContent('Test System')
  })
})
