"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Account } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Loader2 } from "lucide-react"

const accountTypes = [
  { value: "asset", label: "Asset", color: "bg-blue-500" },
  { value: "liability", label: "Liability", color: "bg-red-500" },
  { value: "equity", label: "Equity", color: "bg-purple-500" },
  { value: "revenue", label: "Revenue", color: "bg-green-500" },
  { value: "expense", label: "Expense", color: "bg-amber-500" },
]

const subtypes = {
  asset: ["current", "fixed", "intangible"],
  liability: ["current", "long-term"],
  equity: ["capital", "retained-earnings"],
  revenue: ["operating", "other"],
  expense: ["operating", "administrative", "cost-of-goods"],
}

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "asset" as Account["type"],
    subtype: "current",
  })
  const { toast } = useToast()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/accounting/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast({ title: "Account created successfully" })
        setIsDialogOpen(false)
        setFormData({ code: "", name: "", type: "asset", subtype: "current" })
        fetchAccounts()
      }
    } catch {
      toast({ title: "Error creating account", variant: "destructive" })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const filteredAccounts = accounts.filter(
    (a) =>
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedAccounts = accountTypes.map((type) => ({
    ...type,
    accounts: filteredAccounts.filter((a) => a.type === type.value),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Chart of Accounts</h1>
          <p className="text-muted-foreground">Manage your accounts structure</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Account Code</Label>
                <Input
                  placeholder="e.g., 1000"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input
                  placeholder="e.g., Cash in Hand"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Account["type"]) =>
                    setFormData({ ...formData, type: value, subtype: subtypes[value][0] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subtype</Label>
                <Select
                  value={formData.subtype}
                  onValueChange={(value) => setFormData({ ...formData, subtype: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subtypes[formData.type].map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub.charAt(0).toUpperCase() + sub.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search accounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {groupedAccounts.map((group) => (
            <Card key={group.value}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${group.color}`} />
                  {group.label} Accounts
                  <Badge variant="secondary" className="ml-auto">
                    {group.accounts.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {group.accounts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No accounts</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Subtype</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.accounts.map((account) => (
                        <TableRow key={account._id}>
                          <TableCell className="font-mono">{account.code}</TableCell>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell className="capitalize">{account.subtype?.replace("-", " ")}</TableCell>
                          <TableCell className="text-right">{formatCurrency(account.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
