"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Save, Database, RefreshCw, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [seeding, setSeeding] = useState(false)
  const [saving, setSaving] = useState(false)

  const [businessInfo, setBusinessInfo] = useState({
    name: "Rajyog Stationers",
    address: "Shop No. 5, Main Market, Gujarat, India",
    phone: "0246-2591118",
    email: "rajyogstationers@gmail.com",
    gstNumber: "24AAAAA0000A1Z5",
    bankName: "State Bank of India",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    upiId: "rajyogstationers@sbi",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: "INV",
    defaultTaxRate: "18",
    defaultTerms: "Payment due within 30 days",
    defaultNotes: "Thank you for your business!",
  })

  const seedDatabase = async () => {
    setSeeding(true)
    try {
      const res = await fetch("/api/seed", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        toast({
          title: "Database seeded successfully",
          description: `Added ${data.counts.products} products, ${data.counts.accounts} accounts, ${data.counts.customers} customers`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "Error seeding database", variant: "destructive" })
    } finally {
      setSeeding(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({ title: "Settings saved successfully" })
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business settings and preferences</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Settings</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Your company details that appear on invoices and documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GST Number</Label>
                  <Input
                    value={businessInfo.gstNumber}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, gstNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Payment information for invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={businessInfo.bankName}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={businessInfo.accountNumber}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, accountNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>IFSC Code</Label>
                  <Input
                    value={businessInfo.ifscCode}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, ifscCode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input
                    value={businessInfo.upiId}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, upiId: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Default settings for new invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number Prefix</Label>
                  <Input
                    value={invoiceSettings.prefix}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={invoiceSettings.defaultTaxRate}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, defaultTaxRate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Terms & Conditions</Label>
                <Textarea
                  value={invoiceSettings.defaultTerms}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, defaultTerms: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Notes</Label>
                <Textarea
                  value={invoiceSettings.defaultNotes}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, defaultNotes: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Seed the database with sample data for testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Warning:</strong> Seeding the database will replace existing products, accounts, and customers
                  with sample data. This action cannot be undone.
                </p>
              </div>
              <Button variant="outline" onClick={seedDatabase} disabled={seeding}>
                {seeding ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                Seed Database with Sample Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
