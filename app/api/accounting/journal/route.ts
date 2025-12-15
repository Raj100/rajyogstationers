import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import type { JournalEntry } from "@/lib/types"
import { ObjectId } from "mongodb"

function generateEntryNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `JE${year}${month}${random}`
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const isPosted = searchParams.get("isPosted")

    const query: Record<string, unknown> = {}

    if (isPosted !== null && isPosted !== "all") {
      query.isPosted = isPosted === "true"
    }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) (query.date as Record<string, Date>).$gte = new Date(startDate)
      if (endDate) (query.date as Record<string, Date>).$lte = new Date(endDate)
    }

    const entries = await db
      .collection("journal_entries")
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("journal_entries").countDocuments(query)

    return NextResponse.json({
      entries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Error fetching journal entries:", error)
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Validate debit = credit
    const totalDebit = body.entries.reduce((sum: number, e: { debit: number }) => sum + e.debit, 0)
    const totalCredit = body.entries.reduce((sum: number, e: { credit: number }) => sum + e.credit, 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json({ error: "Debits must equal credits" }, { status: 400 })
    }

    const entry: Omit<JournalEntry, "_id"> = {
      entryNumber: generateEntryNumber(),
      date: new Date(body.date),
      description: body.description,
      entries: body.entries,
      totalDebit,
      totalCredit,
      isPosted: false,
      createdBy: body.createdBy,
      createdAt: new Date(),
    }

    const result = await db.collection("journal_entries").insertOne(entry)

    return NextResponse.json({
      success: true,
      _id: result.insertedId,
      entryNumber: entry.entryNumber,
    })
  } catch (error) {
    console.error("Error creating journal entry:", error)
    return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { _id, action, ...updateData } = body

    if (action === "post") {
      // Post the journal entry - update account balances
      const entry = await db.collection("journal_entries").findOne({ _id: new ObjectId(_id) })

      if (!entry) {
        return NextResponse.json({ error: "Journal entry not found" }, { status: 404 })
      }

      if (entry.isPosted) {
        return NextResponse.json({ error: "Entry already posted" }, { status: 400 })
      }

      // Update account balances and create ledger entries
      for (const line of entry.entries) {
        const balanceChange = line.debit - line.credit

        // For asset and expense accounts, debit increases balance
        // For liability, equity, and revenue accounts, credit increases balance
        await db
          .collection("accounts")
          .updateOne({ _id: new ObjectId(line.accountId) }, { $inc: { balance: balanceChange } })

        // Create ledger entry
        const account = await db.collection("accounts").findOne({ _id: new ObjectId(line.accountId) })
        await db.collection("ledger_entries").insertOne({
          accountId: line.accountId,
          journalEntryId: _id,
          date: entry.date,
          description: entry.description,
          debit: line.debit,
          credit: line.credit,
          balance: account?.balance || 0,
          createdAt: new Date(),
        })
      }

      await db.collection("journal_entries").updateOne({ _id: new ObjectId(_id) }, { $set: { isPosted: true } })

      return NextResponse.json({ success: true, message: "Journal entry posted" })
    }

    // Regular update
    const result = await db
      .collection("journal_entries")
      .updateOne({ _id: new ObjectId(_id), isPosted: false }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Entry not found or already posted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating journal entry:", error)
    return NextResponse.json({ error: "Failed to update journal entry" }, { status: 500 })
  }
}
