import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import type { Customer } from "@/lib/types"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const query: Record<string, unknown> = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    const customers = await db
      .collection("customers")
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("customers").countDocuments(query)

    return NextResponse.json({
      customers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const customer: Omit<Customer, "_id"> = {
      ...body,
      createdAt: new Date(),
    }

    const result = await db.collection("customers").insertOne(customer)

    return NextResponse.json({ success: true, _id: result.insertedId })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { _id, ...updateData } = body

    const result = await db.collection("customers").updateOne({ _id: new ObjectId(_id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}
