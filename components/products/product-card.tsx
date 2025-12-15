"use client"

import type { Product } from "@/lib/types"
import { useApp } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Package } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useApp()
  const { toast } = useToast()

  const addToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { product, quantity: 1 },
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const isLowStock = product.quantity <= product.minStock
  const isOutOfStock = product.quantity === 0

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-square bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground group-hover:scale-110 transition-transform" />
          </div>
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-amber-100 text-amber-800">
              Low Stock
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product._id}`}>
          <Badge variant="outline" className="mb-2 text-xs">
            {product.category}
          </Badge>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
          <p className="text-xs text-muted-foreground">per {product.unit}</p>
        </div>
        <Button size="sm" onClick={addToCart} disabled={isOutOfStock} className="gap-1">
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
