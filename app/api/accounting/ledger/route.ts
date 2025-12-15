import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const accountId = searchParams.get("accountId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const query: Record<string, unknown> = {}

    if (accountId) query.accountId = accountId

    if (startDate || endDate) {
      query.date = {}
      if (startDate) (query.date as Record<string, Date>).$gte = new Date(startDate)
      if (endDate) (query.date as Record<string, Date>).$lte = new Date(endDate)
    }

    const entries = await db
      .collection("ledger_entries")
      .find(query)
      .sort({ date: 1, createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Calculate running balance
    let runningBalance = 0
    const entriesWithBalance = entries.map((entry) => {
      runningBalance += entry.debit - entry.credit
      return { ...entry, runningBalance }
    })

    const total = await db.collection("ledger_entries").countDocuments(query)

    // Get account info if accountId provided
    let account = null
    if (accountId) {
      account = await db.collection("accounts").findOne({ _id: new ObjectId(accountId) })
    }

    return NextResponse.json({
      entries: entriesWithBalance,
      account,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Error fetching ledger entries:", error)
    return NextResponse.json({ error: "Failed to fetch ledger entries" }, { status: 500 })
  }
}
