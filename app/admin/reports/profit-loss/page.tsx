"use client"

import { useState, useEffect } from "react"
import type { ProfitLoss } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Loader2, FileText, Download, Printer, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function ProfitLossPage() {
  const [report, setReport] = useState<ProfitLoss | null>(null)
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()
  const [startDate, setStartDate] = useState(`${currentYear}-04-01`)
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/accounting/reports?type=profit-loss&startDate=${startDate}&endDate=${endDate}`)
      const data = await res.json()
      setReport(data.report)
    } catch (error) {
      console.error("Error fetching P&L:", error)
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profit & Loss Statement</h1>
          <p className="text-muted-foreground">Income and expense summary</p>
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
              <Label className="mb-2 block">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
              Profit & Loss Statement for the period {new Date(startDate).toLocaleDateString("en-IN")} to{" "}
              {new Date(endDate).toLocaleDateString("en-IN")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Revenue Section */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-3">Revenue / Income</h3>
                <Table>
                  <TableBody>
                    {report.revenue.items.map((item) => (
                      <TableRow key={item.accountCode}>
                        <TableCell className="font-mono text-muted-foreground w-24">{item.accountCode}</TableCell>
                        <TableCell>{item.accountName}</TableCell>
                        <TableCell className="text-right w-40">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-green-50 dark:bg-green-950/20 font-semibold">
                      <TableCell colSpan={2}>Total Revenue</TableCell>
                      <TableCell className="text-right">{formatCurrency(report.totalRevenue)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Expenses Section */}
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-3">Expenses</h3>
                <Table>
                  <TableBody>
                    {report.expenses.items.map((item) => (
                      <TableRow key={item.accountCode}>
                        <TableCell className="font-mono text-muted-foreground w-24">{item.accountCode}</TableCell>
                        <TableCell>{item.accountName}</TableCell>
                        <TableCell className="text-right w-40">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-red-50 dark:bg-red-950/20 font-semibold">
                      <TableCell colSpan={2}>Total Expenses</TableCell>
                      <TableCell className="text-right">{formatCurrency(report.totalExpenses)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              {/* Summary Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Gross Profit</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(report.grossProfit)}</p>
                  </CardContent>
                </Card>
                <Card
                  className={
                    report.netProfit >= 0 ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"
                  }
                >
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Net Profit/Loss</p>
                      <p className={`text-2xl font-bold ${report.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(report.netProfit)}
                      </p>
                    </div>
                    {report.netProfit >= 0 ? (
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {report.totalRevenue > 0 ? ((report.netProfit / report.totalRevenue) * 100).toFixed(1) : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
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
