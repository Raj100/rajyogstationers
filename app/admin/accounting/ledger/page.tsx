"use client"

import { useState, useEffect } from "react"
import type { Account, LedgerEntry } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, BookOpen } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function LedgerPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounting/accounts")
      const data = await res.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error("Error fetching accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLedger = async (accountId: string) => {
    setEntriesLoading(true)
    try {
      let url = `/api/accounting/ledger?accountId=${accountId}`
      if (startDate) url += `&startDate=${startDate}`
      if (endDate) url += `&endDate=${endDate}`

      const res = await fetch(url)
      const data = await res.json()
      setEntries(data.entries || [])
    } catch (error) {
      console.error("Error fetching ledger:", error)
    } finally {
      setEntriesLoading(false)
    }
  }

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId)
    if (accountId) fetchLedger(accountId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const selectedAccountData = accounts.find((a) => a._id === selectedAccount)
  let runningBalance = 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">General Ledger</h1>
        <p className="text-muted-foreground">View account-wise transaction details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="mb-2 block">Account</Label>
              <Select value={selectedAccount} onValueChange={handleAccountChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={() => selectedAccount && fetchLedger(selectedAccount)} disabled={!selectedAccount}>
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedAccountData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {selectedAccountData.code} - {selectedAccountData.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {selectedAccountData.type} • {selectedAccountData.subtype?.replace("-", " ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(selectedAccountData.balance)}</p>
            </div>
          </CardHeader>
          <CardContent>
            {entriesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No ledger entries found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => {
                      if (["asset", "expense"].includes(selectedAccountData.type)) {
                        runningBalance += entry.debit - entry.credit
                      } else {
                        runningBalance += entry.credit - entry.debit
                      }
                      return (
                        <TableRow key={entry._id}>
                          <TableCell>{new Date(entry.date).toLocaleDateString("en-IN")}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell className="text-right">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(runningBalance)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
