import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Get overdue invoices
    const overdueInvoices = await db
      .collection("invoices")
      .find({
        status: { $in: ["sent", "partial"] },
        dueDate: { $lt: new Date() },
        balance: { $gt: 0 },
      })
      .toArray()

    // Get customer details and send reminders
    for (const invoice of overdueInvoices) {
      const customer = await db.collection("customers").findOne({ _id: invoice.customerId })

      if (customer?.email) {
        console.log("Sending payment reminder:", {
          to: customer.email,
          invoiceNumber: invoice.invoiceNumber,
          balance: invoice.balance,
          dueDate: invoice.dueDate,
        })

        // Simulated email sending
        // await sendEmail({
        //   to: customer.email,
        //   subject: `Payment Reminder - Invoice ${invoice.invoiceNumber}`,
        //   template: 'payment-reminder',
        //   data: { invoiceNumber: invoice.invoiceNumber, balance: invoice.balance }
        // })
      }
    }

    // Update status to overdue
    await db
      .collection("invoices")
      .updateMany({ _id: { $in: overdueInvoices.map((i) => i._id) } }, { $set: { status: "overdue" } })

    return NextResponse.json({
      success: true,
      message: `Sent ${overdueInvoices.length} payment reminders`,
    })
  } catch (error) {
    console.error("Error sending payment reminders:", error)
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 })
  }
}

// This can be called by a cron job
export async function GET() {
  return POST(new Request(""))
}
