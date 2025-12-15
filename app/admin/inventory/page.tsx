"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Search, Loader2, Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentQty, setAdjustmentQty] = useState("")
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=200")
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustment = async () => {
    if (!selectedProduct || !adjustmentQty) return

    const qty = Number.parseInt(adjustmentQty)
    const newQty =
      adjustmentType === "add" ? selectedProduct.quantity + qty : Math.max(0, selectedProduct.quantity - qty)

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: selectedProduct._id, quantity: newQty }),
      })
      if (res.ok) {
        toast({ title: "Inventory updated successfully" })
        setIsDialogOpen(false)
        setAdjustmentQty("")
        setSelectedProduct(null)
        fetchProducts()
      }
    } catch {
      toast({ title: "Error updating inventory", variant: "destructive" })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const lowStockCount = products.filter((p) => p.quantity <= p.minStock).length
  const outOfStockCount = products.filter((p) => p.quantity === 0).length
  const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.quantity, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Min Stock</TableHead>
                    <TableHead className="text-right">Cost Price</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                      <TableCell className="capitalize">{product.category}</TableCell>
                      <TableCell className="text-right">
                        {product.quantity} {product.unit}
                      </TableCell>
                      <TableCell className="text-right">{product.minStock}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.costPrice)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.costPrice * product.quantity)}
                      </TableCell>
                      <TableCell>
                        {product.quantity === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : product.quantity <= product.minStock ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={isDialogOpen && selectedProduct?._id === product._id}
                          onOpenChange={(open) => {
                            setIsDialogOpen(open)
                            if (!open) setSelectedProduct(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                              Adjust
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Stock: {product.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Current Stock</p>
                                  <p className="text-3xl font-bold">{product.quantity}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant={adjustmentType === "add" ? "default" : "outline"}
                                  className="flex-1"
                                  onClick={() => setAdjustmentType("add")}
                                >
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Add Stock
                                </Button>
                                <Button
                                  variant={adjustmentType === "remove" ? "default" : "outline"}
                                  className="flex-1"
                                  onClick={() => setAdjustmentType("remove")}
                                >
                                  <TrendingDown className="h-4 w-4 mr-2" />
                                  Remove Stock
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={adjustmentQty}
                                  onChange={(e) => setAdjustmentQty(e.target.value)}
                                  placeholder="Enter quantity"
                                />
                              </div>
                              <Button onClick={handleAdjustment} className="w-full">
                                Update Stock
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
