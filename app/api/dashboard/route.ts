import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfYear = new Date(today.getFullYear(), 0, 1)

    // Get counts
    const totalProducts = await db.collection("products").countDocuments({ isActive: true })
    const totalCustomers = await db.collection("customers").countDocuments()
    const totalOrders = await db.collection("orders").countDocuments()
    const pendingOrders = await db.collection("orders").countDocuments({ status: "pending" })

    // Get low stock products
    const lowStockProducts = await db
      .collection("products")
      .find({ $expr: { $lte: ["$quantity", "$minStock"] }, isActive: true })
      .limit(10)
      .toArray()

    // Get monthly revenue
    const monthlyOrders = await db
      .collection("orders")
      .find({ createdAt: { $gte: startOfMonth }, status: { $ne: "cancelled" } })
      .toArray()

    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Get yearly revenue
    const yearlyOrders = await db
      .collection("orders")
      .find({ createdAt: { $gte: startOfYear }, status: { $ne: "cancelled" } })
      .toArray()

    const yearlyRevenue = yearlyOrders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Get recent orders
    const recentOrders = await db.collection("orders").find().sort({ createdAt: -1 }).limit(5).toArray()

    // Get pending invoices
    const pendingInvoices = await db
      .collection("invoices")
      .find({ status: { $in: ["sent", "partial", "overdue"] } })
      .sort({ dueDate: 1 })
      .limit(5)
      .toArray()

    // Get total receivables
    const allInvoices = await db
      .collection("invoices")
      .find({ status: { $in: ["sent", "partial", "overdue"] } })
      .toArray()

    const totalReceivables = allInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0)

    // Get inventory value
    const products = await db.collection("products").find({ isActive: true }).toArray()
    const inventoryValue = products.reduce((sum, p) => sum + p.costPrice * p.quantity, 0)

    return NextResponse.json({
      stats: {
        totalProducts,
        totalCustomers,
        totalOrders,
        pendingOrders,
        monthlyRevenue,
        yearlyRevenue,
        totalReceivables,
        inventoryValue,
      },
      lowStockProducts,
      recentOrders,
      pendingInvoices,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
