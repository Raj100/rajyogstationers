"use client"

import { useState, useEffect } from "react"
import type { BalanceSheet } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Loader2, FileText, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function BalanceSheetPage() {
  const [report, setReport] = useState<BalanceSheet | null>(null)
  const [loading, setLoading] = useState(true)
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/accounting/reports?type=balance-sheet&asOfDate=${asOfDate}`)
      const data = await res.json()
      setReport(data.report)
    } catch (error) {
      console.error("Error fetching balance sheet:", error)
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

  const Section = ({
    title,
    items,
    total,
    colorClass,
  }: {
    title: string
    items: { accountCode: string; accountName: string; balance: number }[]
    total: number
    colorClass: string
  }) => (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-3 ${colorClass}`}>{title}</h3>
      <Table>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.accountCode}>
              <TableCell className="font-mono text-muted-foreground w-24">{item.accountCode}</TableCell>
              <TableCell>{item.accountName}</TableCell>
              <TableCell className="text-right w-40">{formatCurrency(Math.abs(item.balance))}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50 font-semibold">
            <TableCell colSpan={2}>Total {title}</TableCell>
            <TableCell className="text-right">{formatCurrency(Math.abs(total))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Balance Sheet</h1>
          <p className="text-muted-foreground">Statement of financial position</p>
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
              Balance Sheet as on{" "}
              {new Date(asOfDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Section
                  title="Assets"
                  items={report.assets.items}
                  total={report.totalAssets}
                  colorClass="text-blue-600"
                />
              </div>
              <div>
                <Section
                  title="Liabilities"
                  items={report.liabilities.items}
                  total={report.totalLiabilities}
                  colorClass="text-red-600"
                />
                <Separator className="my-4" />
                <Section
                  title="Equity"
                  items={report.equity.items}
                  total={report.totalEquity}
                  colorClass="text-purple-600"
                />
              </div>
            </div>
            <Separator className="my-6" />
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(report.totalAssets)}</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 dark:bg-purple-950/20">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Liabilities + Equity</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(report.totalLiabilities + report.totalEquity)}
                  </p>
                </CardContent>
              </Card>
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
