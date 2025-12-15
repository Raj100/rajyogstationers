"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Account } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2, AlertCircle, CheckCircle, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface JournalLine {
  accountId: string
  accountName: string
  accountCode: string
  debit: number
  credit: number
}

export default function NewJournalEntryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
  })

  const [lines, setLines] = useState<JournalLine[]>([
    { accountId: "", accountName: "", accountCode: "", debit: 0, credit: 0 },
    { accountId: "", accountName: "", accountCode: "", debit: 0, credit: 0 },
  ])

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounting/accounts?isActive=true")
      const data = await res.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error("Error fetching accounts:", error)
    }
  }

  const addLine = () => {
    setLines([...lines, { accountId: "", accountName: "", accountCode: "", debit: 0, credit: 0 }])
  }

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index))
    }
  }

  const updateLine = (index: number, field: keyof JournalLine, value: string | number) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }
    setLines(newLines)
  }

  const selectAccount = (index: number, accountId: string) => {
    const account = accounts.find((a) => a._id === accountId)
    if (account) {
      const newLines = [...lines]
      newLines[index] = {
        ...newLines[index],
        accountId: account._id,
        accountName: account.name,
        accountCode: account.code,
      }
      setLines(newLines)
    }
  }

  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0)
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isBalanced) {
      toast({ title: "Debits must equal credits", variant: "destructive" })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/accounting/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          description: formData.description,
          entries: lines.filter((l) => l.accountId && (l.debit > 0 || l.credit > 0)),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast({ title: `Journal entry ${data.entryNumber} created` })
        router.push("/admin/accounting/journal")
      } else {
        throw new Error("Failed to create entry")
      }
    } catch (error) {
      toast({ title: "Error creating journal entry", variant: "destructive" })
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/accounting/journal">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Journal Entry</h1>
          <p className="text-muted-foreground">Record a new accounting transaction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the transaction"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Account Lines</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4 mr-2" />
                Add Line
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                  <div className="col-span-5">Account</div>
                  <div className="col-span-3">Debit (₹)</div>
                  <div className="col-span-3">Credit (₹)</div>
                  <div className="col-span-1"></div>
                </div>

                {lines.map((line, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Select value={line.accountId} onValueChange={(value) => selectAccount(index, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
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
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={line.debit || ""}
                        onChange={(e) => updateLine(index, "debit", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        disabled={line.credit > 0}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={line.credit || ""}
                        onChange={(e) => updateLine(index, "credit", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        disabled={line.debit > 0}
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLine(index)}
                        disabled={lines.length <= 2}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-12 gap-2 pt-4 border-t font-semibold">
                  <div className="col-span-5">Total</div>
                  <div className="col-span-3">{formatCurrency(totalDebit)}</div>
                  <div className="col-span-3">{formatCurrency(totalCredit)}</div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {!isBalanced && totalDebit > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Debits ({formatCurrency(totalDebit)}) and Credits ({formatCurrency(totalCredit)}) must be equal.
                    Difference: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                  </AlertDescription>
                </Alert>
              )}

              {isBalanced && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">Entry is balanced!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/accounting/journal">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading || !isBalanced}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Entry
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
