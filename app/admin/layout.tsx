"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Calculator,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ClipboardList,
  Building2,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inventory", href: "/admin/inventory", icon: ClipboardList },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Invoices", href: "/admin/invoices", icon: FileText },
  {
    name: "Accounting",
    icon: Calculator,
    children: [
      { name: "Chart of Accounts", href: "/admin/accounting/accounts" },
      { name: "Journal Entries", href: "/admin/accounting/journal" },
      { name: "Ledger", href: "/admin/accounting/ledger" },
    ],
  },
  {
    name: "Financial Reports",
    icon: BarChart3,
    children: [
      { name: "Trial Balance", href: "/admin/reports/trial-balance" },
      { name: "Balance Sheet", href: "/admin/reports/balance-sheet" },
      { name: "Profit & Loss", href: "/admin/reports/profit-loss" },
      { name: "Financial Ratios", href: "/admin/reports/ratios" },
    ],
  },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const NavItem = ({ item }: { item: (typeof navigation)[0] }) => {
    const isActive = item.href === pathname || item.children?.some((child) => child.href === pathname)

    if (item.children) {
      return (
        <Collapsible defaultOpen={isActive}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-12 space-y-1 mt-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block px-4 py-2 text-sm rounded-lg transition-colors",
                  pathname === child.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                {child.name}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        href={item.href!}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-4 bg-sidebar-background px-4 py-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-sidebar-primary" />
          <span className="font-bold text-sidebar-foreground">Rajyog Admin</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-background transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <Building2 className="h-8 w-8 text-sidebar-primary" />
          <div>
            <span className="font-bold text-sidebar-foreground text-lg">Rajyog</span>
            <span className="text-sidebar-primary font-bold text-lg">ERP</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          <div className="mt-8 px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </ScrollArea>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
