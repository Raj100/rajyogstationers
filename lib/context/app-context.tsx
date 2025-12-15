"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Cart, CartItem, Product, Customer } from "@/lib/types"

interface AppState {
  cart: Cart
  customer: Customer | null
  isAdmin: boolean
  theme: "light" | "dark"
}

type AppAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CUSTOMER"; payload: Customer | null }
  | { type: "SET_ADMIN"; payload: boolean }
  | { type: "TOGGLE_THEME" }
  | { type: "LOAD_CART"; payload: Cart }

const initialState: AppState = {
  cart: { items: [], subtotal: 0, tax: 0, total: 0 },
  customer: null,
  isAdmin: false,
  theme: "light",
}

function calculateCartTotals(items: CartItem[]): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax
  return { subtotal, tax, total }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingIndex = state.cart.items.findIndex((item) => item.productId === action.payload.product._id)
      let newItems: CartItem[]
      if (existingIndex >= 0) {
        newItems = state.cart.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
      } else {
        newItems = [
          ...state.cart.items,
          {
            productId: action.payload.product._id,
            product: action.payload.product,
            quantity: action.payload.quantity,
          },
        ]
      }
      const totals = calculateCartTotals(newItems)
      return { ...state, cart: { items: newItems, ...totals } }
    }
    case "REMOVE_FROM_CART": {
      const newItems = state.cart.items.filter((item) => item.productId !== action.payload)
      const totals = calculateCartTotals(newItems)
      return { ...state, cart: { items: newItems, ...totals } }
    }
    case "UPDATE_CART_QUANTITY": {
      const newItems = state.cart.items
        .map((item) =>
          item.productId === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item,
        )
        .filter((item) => item.quantity > 0)
      const totals = calculateCartTotals(newItems)
      return { ...state, cart: { items: newItems, ...totals } }
    }
    case "CLEAR_CART":
      return { ...state, cart: { items: [], subtotal: 0, tax: 0, total: 0 } }
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload }
    case "SET_ADMIN":
      return { ...state, isAdmin: action.payload }
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" }
    case "LOAD_CART":
      return { ...state, cart: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const savedCart = localStorage.getItem("rajyog_cart")
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cart })
      } catch (e) {
        console.error("Failed to load cart:", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("rajyog_cart", JSON.stringify(state.cart))
  }, [state.cart])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
