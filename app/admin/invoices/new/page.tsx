"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Customer, Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface InvoiceItem {
  productId?: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [formData, setFormData] = useState({
    customerId: "",
    dueDate: "",
    taxRate: 18,
    discount: 0,
    notes: "",
    terms: "Payment due within 30 days",
  })

  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, rate: 0, amount: 0 }])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        fetch("/api/customers?limit=100"),
        fetch("/api/products?limit=100"),
      ])
      const customersData = await customersRes.json()
      const productsData = await productsRes.json()
      setCustomers(customersData.customers || [])
      setProducts(productsData.products || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalculate amount
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }

    setItems(newItems)
  }

  const selectProduct = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId)
    if (product) {
      const newItems = [...items]
      newItems[index] = {
        productId: product._id,
        description: product.name,
        quantity: 1,
        rate: product.price,
        amount: product.price,
      }
      setItems(newItems)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = subtotal * (formData.taxRate / 100)
  const total = subtotal + taxAmount - formData.discount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: formData.customerId,
          items,
          subtotal,
          taxAmount,
          taxRate: formData.taxRate,
          discount: formData.discount,
          total,
          dueDate: new Date(formData.dueDate),
          notes: formData.notes,
          terms: formData.terms,
          status: "draft",
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast({ title: `Invoice ${data.invoiceNumber} created successfully` })
        router.push("/admin/invoices")
      } else {
        throw new Error("Failed to create invoice")
      }
    } catch (error) {
      toast({ title: "Error creating invoice", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground">Generate a new invoice for a customer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer *</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Invoice Items</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <Label className="text-xs">Product/Description</Label>
                        <Select value={item.productId || ""} onValueChange={(value) => selectProduct(index, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select or type" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product._id} value={product._id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Rate (₹)</Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Amount</Label>
                        <Input value={formatCurrency(item.amount)} readOnly className="bg-muted" />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes for the customer"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Textarea
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>GST (%)</span>
                  <Input
                    type="number"
                    className="w-20 text-right"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: Number.parseFloat(e.target.value) || 0 })}
                  />
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Discount (₹)</span>
                  <Input
                    type="number"
                    className="w-24 text-right"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Create Invoice
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/invoices">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
