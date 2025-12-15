"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { JournalEntry } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Loader2, BookOpen, CheckCircle } from "lucide-react"

export default function JournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/accounting/journal?limit=100")
      const data = await res.json()
      setEntries(data.entries || [])
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const postEntry = async (id: string) => {
    try {
      const res = await fetch("/api/accounting/journal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, action: "post" }),
      })

      if (res.ok) {
        toast({ title: "Journal entry posted to ledger" })
        fetchEntries()
      }
    } catch (error) {
      toast({ title: "Error posting entry", variant: "destructive" })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const filteredEntries = entries.filter(
    (e) =>
      e.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Journal Entries</h1>
          <p className="text-muted-foreground">Record and manage journal entries</p>
        </div>
        <Button asChild>
          <Link href="/admin/accounting/journal/new">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No journal entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="font-mono font-medium">{entry.entryNumber}</TableCell>
                      <TableCell>{new Date(entry.date).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.totalDebit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.totalCredit)}</TableCell>
                      <TableCell>
                        <Badge variant={entry.isPosted ? "default" : "secondary"}>
                          {entry.isPosted ? "Posted" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!entry.isPosted && (
                          <Button variant="outline" size="sm" onClick={() => postEntry(entry._id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Post
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
