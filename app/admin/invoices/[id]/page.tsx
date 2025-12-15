"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import type { Invoice } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Printer, Mail, Download, Loader2, CheckCircle } from "lucide-react"

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  partial: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
}

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices?_id=${id}`)
      const data = await res.json()
      if (data.invoices?.length > 0) {
        setInvoice(data.invoices[0])
      }
    } catch (error) {
      console.error("Error fetching invoice:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendInvoiceEmail = async () => {
    if (!invoice) return
    setSending(true)
    try {
      const res = await fetch("/api/email/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice._id,
          email: invoice.customer?.email,
        }),
      })
      if (res.ok) {
        toast({ title: "Invoice sent to customer's email" })
        // Update status to sent
        await fetch("/api/invoices", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: invoice._id, status: "sent" }),
        })
        fetchInvoice()
      }
    } catch {
      toast({ title: "Error sending email", variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  const markAsPaid = async () => {
    if (!invoice) return
    try {
      await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: invoice._id,
          status: "paid",
          amountPaid: invoice.total,
          balance: 0,
        }),
      })
      toast({ title: "Invoice marked as paid" })
      fetchInvoice()
    } catch {
      toast({ title: "Error updating invoice", variant: "destructive" })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Invoice not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/invoices">Back to Invoices</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(invoice.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={sendInvoiceEmail} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
            Send Email
          </Button>
          {invoice.status !== "paid" && (
            <Button variant="default" onClick={markAsPaid}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Preview */}
      <Card className="print:shadow-none">
        <CardHeader className="text-center border-b">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-primary">RAJYOG STATIONERS</h2>
              <p className="text-sm text-muted-foreground">
                Housekeeping | Safety | Account Books | Industrial Supplies
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Rajyog Complex, Main Market Road
                <br />
                Anand, Gujarat - 388001
                <br />
                Phone: 0246-2591118
                <br />
                Email: rajyogstationers@gmail.com
                <br />
                GSTIN: 24AAAAA0000A1Z5
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-3xl font-bold mb-2">INVOICE</h3>
              <p className="font-mono text-lg">{invoice.invoiceNumber}</p>
              <Badge className={`mt-2 ${statusColors[invoice.status]}`}>{invoice.status.toUpperCase()}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-muted-foreground mb-2">Bill To:</h4>
              <p className="font-medium">{invoice.customer?.name}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.customer?.address?.street}
                <br />
                {invoice.customer?.address?.city}, {invoice.customer?.address?.state} -{" "}
                {invoice.customer?.address?.pincode}
                <br />
                Phone: {invoice.customer?.phone}
                <br />
                Email: {invoice.customer?.email}
                {invoice.customer?.gstNumber && (
                  <>
                    <br />
                    GSTIN: {invoice.customer.gstNumber}
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Invoice Date:</span>{" "}
                  {new Date(invoice.createdAt).toLocaleDateString("en-IN")}
                </p>
                <p>
                  <span className="text-muted-foreground">Due Date:</span>{" "}
                  {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-6">
            <div className="w-72 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({invoice.taxRate}%)</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Amount Paid</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-primary">
                <span>Balance Due</span>
                <span>{formatCurrency(invoice.balance)}</span>
              </div>
            </div>
          </div>

          {(invoice.notes || invoice.terms) && (
            <div className="mt-8 pt-6 border-t">
              {invoice.notes && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Notes:</h4>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="font-semibold mb-1">Terms & Conditions:</h4>
                  <p className="text-sm text-muted-foreground">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-2">
              Bank: State Bank of India | A/C: 1234567890 | IFSC: SBIN0001234 | UPI: rajyogstationers@sbi
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
