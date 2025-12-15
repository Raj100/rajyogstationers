"use client"

import { useState, useEffect } from "react"
import type { TrialBalance } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, FileText, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function TrialBalancePage() {
  const [report, setReport] = useState<TrialBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/accounting/reports?type=trial-balance&asOfDate=${asOfDate}`)
      const data = await res.json()
      setReport(data.report)
    } catch (error) {
      console.error("Error fetching trial balance:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const isBalanced = report && Math.abs(report.totalDebit - report.totalCredit) < 0.01

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trial Balance</h1>
          <p className="text-muted-foreground">Summary of all account balances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <Label className="mb-2 block">As of Date</Label>
              <Input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
            </div>
            <Button onClick={fetchReport}>Generate Report</Button>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : report ? (
        <Card>
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl">RAJYOG STATIONERS</CardTitle>
            <CardDescription className="text-base">
              Trial Balance as on{" "}
              {new Date(asOfDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
            <Badge variant={isBalanced ? "default" : "destructive"} className="mx-auto mt-2">
              {isBalanced ? "Balanced" : "Not Balanced"}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Debit (₹)</TableHead>
                  <TableHead className="text-right">Credit (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.accounts
                  .filter((a) => a.debit > 0 || a.credit > 0)
                  .map((account) => (
                    <TableRow key={account.accountId}>
                      <TableCell className="font-mono">{account.accountCode}</TableCell>
                      <TableCell className="font-medium">{account.accountName}</TableCell>
                      <TableCell className="capitalize">{account.accountType}</TableCell>
                      <TableCell className="text-right">
                        {account.debit > 0 ? formatCurrency(account.debit) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.credit > 0 ? formatCurrency(account.credit) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow className="bg-primary/10 font-bold">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">{formatCurrency(report.totalDebit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(report.totalCredit)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  )
}
