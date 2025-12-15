"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useApp } from "@/lib/context/app-context"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Truck, Shield, Loader2 } from "lucide-react"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { dispatch } = useApp()
  const { toast } = useToast()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products?_id=${id}`)
      const data = await res.json()
      if (data.products?.length > 0) {
        setProduct(data.products[0])
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return
    dispatch({
      type: "ADD_TO_CART",
      payload: { product, quantity },
    })
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const isOutOfStock = product.quantity === 0
  const isLowStock = product.quantity <= product.minStock && product.quantity > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center relative">
            <Package className="h-32 w-32 text-muted-foreground" />
            {isOutOfStock && (
              <Badge variant="destructive" className="absolute top-4 left-4 text-lg px-4 py-1">
                Out of Stock
              </Badge>
            )}
            {isLowStock && (
              <Badge className="absolute top-4 left-4 bg-amber-100 text-amber-800 text-lg px-4 py-1">
                Only {product.quantity} left!
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>

            <Separator />

            <div className="flex items-end gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</p>
                <p className="text-sm text-muted-foreground">per {product.unit}</p>
              </div>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <p className="font-medium">Quantity:</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={isOutOfStock || quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {!isOutOfStock && <p className="text-sm text-muted-foreground">{product.quantity} available</p>}
            </div>

            {/* Add to Cart */}
            <Button size="lg" className="w-full" onClick={addToCart} disabled={isOutOfStock}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isOutOfStock ? "Out of Stock" : `Add to Cart - ${formatCurrency(product.price * quantity)}`}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 flex items-center gap-3">
                  <Truck className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">Across Gujarat</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Quality Assured</p>
                    <p className="text-xs text-muted-foreground">Genuine Products</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
