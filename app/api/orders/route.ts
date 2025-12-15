import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import type { Order } from "@/lib/types"
import { ObjectId } from "mongodb"

function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD${year}${month}${random}`
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const customerId = searchParams.get("customerId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const query: Record<string, unknown> = {}

    if (status && status !== "all") query.status = status
    if (customerId) query.customerId = customerId

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) (query.createdAt as Record<string, Date>).$gte = new Date(startDate)
      if (endDate) (query.createdAt as Record<string, Date>).$lte = new Date(endDate)
    }

    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Populate customer data
    const customerIds = [...new Set(orders.map((o) => o.customerId).filter(Boolean))]
    const customers = await db
      .collection("customers")
      .find({ _id: { $in: customerIds.map((id) => new ObjectId(id)) } })
      .toArray()

    const customerMap = new Map(customers.map((c) => [c._id.toString(), c]))

    const populatedOrders = orders.map((order) => ({
      ...order,
      customer: customerMap.get(order.customerId),
    }))

    const total = await db.collection("orders").countDocuments(query)

    return NextResponse.json({
      orders: populatedOrders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const order: Omit<Order, "_id"> = {
      ...body,
      orderNumber: generateOrderNumber(),
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(order)

    // Update inventory
    for (const item of body.items) {
      await db
        .collection("products")
        .updateOne({ _id: new ObjectId(item.productId) }, { $inc: { quantity: -item.quantity } })
    }

    return NextResponse.json({
      success: true,
      _id: result.insertedId,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { _id, ...updateData } = body

    const result = await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(_id) }, { $set: { ...updateData, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
