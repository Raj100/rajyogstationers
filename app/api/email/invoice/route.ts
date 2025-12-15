import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { invoiceId, email } = body

    const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(invoiceId) })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // In production, generate PDF and send via email service
    console.log("Sending invoice email:", {
      to: email,
      subject: `Invoice ${invoice.invoiceNumber} from Rajyog Stationers`,
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total,
    })

    // Simulated email sending
    // await sendEmail({
    //   to: email,
    //   subject: `Invoice ${invoice.invoiceNumber}`,
    //   template: 'invoice',
    //   attachments: [{ filename: `${invoice.invoiceNumber}.pdf`, content: pdfBuffer }]
    // })

    return NextResponse.json({ success: true, message: "Invoice email sent" })
  } catch (error) {
    console.error("Error sending invoice email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
