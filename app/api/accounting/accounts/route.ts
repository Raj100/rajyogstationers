import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import type { Account } from "@/lib/types"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type")
    const isActive = searchParams.get("isActive")

    const query: Record<string, unknown> = {}

    if (type && type !== "all") query.type = type
    if (isActive !== null && isActive !== "all") query.isActive = isActive === "true"

    const accounts = await db.collection("accounts").find(query).sort({ code: 1 }).toArray()

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Check if code already exists
    const existing = await db.collection("accounts").findOne({ code: body.code })
    if (existing) {
      return NextResponse.json({ error: "Account code already exists" }, { status: 400 })
    }

    const account: Omit<Account, "_id"> = {
      ...body,
      balance: body.balance || 0,
      isActive: true,
      createdAt: new Date(),
    }

    const result = await db.collection("accounts").insertOne(account)

    return NextResponse.json({ success: true, _id: result.insertedId })
  } catch (error) {
    console.error("Error creating account:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { _id, ...updateData } = body

    const result = await db.collection("accounts").updateOne({ _id: new ObjectId(_id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 })
  }
}
