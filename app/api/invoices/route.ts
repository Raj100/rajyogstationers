import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import type { Invoice } from "@/lib/types"
import { ObjectId } from "mongodb"

function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `INV${year}${month}${random}`
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
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    const query: Record<string, unknown> = {}

    if (status && status !== "all") query.status = status
    if (customerId) query.customerId = customerId

    if (month && year) {
      const startOfMonth = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
      const endOfMonth = new Date(Number.parseInt(year), Number.parseInt(month), 0, 23, 59, 59)
      query.createdAt = { $gte: startOfMonth, $lte: endOfMonth }
    } else if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) (query.createdAt as Record<string, Date>).$gte = new Date(startDate)
      if (endDate) (query.createdAt as Record<string, Date>).$lte = new Date(endDate)
    }

    const invoices = await db
      .collection("invoices")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Populate customer data
    const customerIds = [...new Set(invoices.map((i) => i.customerId).filter(Boolean))]
    const customers = await db
      .collection("customers")
      .find({ _id: { $in: customerIds.map((id) => new ObjectId(id)) } })
      .toArray()

    const customerMap = new Map(customers.map((c) => [c._id.toString(), c]))

    const populatedInvoices = invoices.map((invoice) => ({
      ...invoice,
      customer: customerMap.get(invoice.customerId),
    }))

    const total = await db.collection("invoices").countDocuments(query)

    return NextResponse.json({
      invoices: populatedInvoices,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const invoice: Omit<Invoice, "_id"> = {
      ...body,
      invoiceNumber: generateInvoiceNumber(),
      status: body.status || "draft",
      amountPaid: body.amountPaid || 0,
      balance: body.total - (body.amountPaid || 0),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("invoices").insertOne(invoice)

    return NextResponse.json({
      success: true,
      _id: result.insertedId,
      invoiceNumber: invoice.invoiceNumber,
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { _id, ...updateData } = body

    if (updateData.amountPaid !== undefined && updateData.total !== undefined) {
      updateData.balance = updateData.total - updateData.amountPaid
      if (updateData.balance <= 0) {
        updateData.status = "paid"
      } else if (updateData.amountPaid > 0) {
        updateData.status = "partial"
      }
    }

    const result = await db
      .collection("invoices")
      .updateOne({ _id: new ObjectId(_id) }, { $set: { ...updateData, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}
