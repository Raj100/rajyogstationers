"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Users,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react"

interface DashboardData {
  stats: {
    totalProducts: number
    totalCustomers: number
    totalOrders: number
    pendingOrders: number
    monthlyRevenue: number
    yearlyRevenue: number
    totalReceivables: number
    inventoryValue: number
  }
  lowStockProducts: Array<{ _id: string; name: string; quantity: number; minStock: number }>
  recentOrders: Array<{ _id: string; orderNumber: string; total: number; status: string; createdAt: string }>
  pendingInvoices: Array<{
    _id: string
    invoiceNumber: string
    balance: number
    dueDate: string
    customer?: { name: string }
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard")
      const dashboardData = await res.json()
      setData(dashboardData)
    } catch (error) {
      console.error("Error fetching dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = data?.stats || {
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    totalReceivables: 0,
    inventoryValue: 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receivables</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalReceivables)}</div>
            <p className="text-xs text-muted-foreground">Outstanding invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.inventoryValue)}</div>
            <p className="text-xs text-muted-foreground">{stats.totalProducts} products</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Yearly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.yearlyRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {data.lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Min: {product.minStock} | Current: {product.quantity}
                      </p>
                    </div>
                    <Badge variant={product.quantity === 0 ? "destructive" : "secondary"}>
                      {product.quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/admin/inventory">
                    View Inventory <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">All products are well stocked!</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Pending Invoices
            </CardTitle>
            <CardDescription>Invoices awaiting payment</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.pendingInvoices && data.pendingInvoices.length > 0 ? (
              <div className="space-y-4">
                {data.pendingInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer?.name || "Unknown"} | Due:{" "}
                        {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span className="font-semibold text-primary">{formatCurrency(invoice.balance)}</span>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/admin/invoices">
                    View All Invoices <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No pending invoices!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/admin/products/new">Add New Product</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/invoices/new">Create Invoice</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/accounting/journal/new">New Journal Entry</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/customers/new">Add Customer</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
