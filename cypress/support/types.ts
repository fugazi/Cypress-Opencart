/**
 * Type definitions for fixture data used across the Music-Tech Shop suite.
 * These mirror the JSON schemas in cypress/fixtures/.
 */

export type UserRole = 'admin' | 'customer'

export interface DemoUser {
  email: string
  password: string
  role: UserRole
}

export interface UsersFixture {
  admin: DemoUser
  customer: DemoUser
}

export type ProductCategory = 'Electronics' | 'Accessories' | 'Photography'

export interface Product {
  id: number | string
  slug: string
  name: string
  category: ProductCategory
  price: number
  description?: string
}

export interface ProductsFixture {
  products: Product[]
  categories: ProductCategory[]
  sortOptions: string[]
}

export interface CartItem {
  productId: number | string
  quantity: number
  expectedSubtotal?: number
}

export interface CartItemsFixture {
  items: CartItem[]
}
