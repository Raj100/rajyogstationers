"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Search } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const [orderNumber, setOrderNumber] = useState("")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Track Your Order</CardTitle>
              <CardDescription>Enter your order number to check the status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Order Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., ORD-2024-001"
                  />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Can't find your order number? Check your confirmation email or{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    contact us
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
