import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductCard from './ProductCard'

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 599,
  image: 'https://example.com/image.jpg',
}

describe('ProductCard', () => {
  it('renders product image, title, and price', () => {
    render(<ProductCard product={mockProduct} />)

    const img = screen.getByRole('img', { name: 'Test Product' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Product')
    expect(screen.getByLabelText('Price ₹599')).toHaveTextContent('₹599')
  })

  it('uses lazy loading for images', () => {
    render(<ProductCard product={mockProduct} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'lazy')
  })
})
