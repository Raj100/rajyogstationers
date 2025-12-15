"use client"

import Link from "next/link"
import { useState } from "react"
import { useApp } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Menu, Search, User, Phone, Mail, ChevronDown } from "lucide-react"
import { CartSheet } from "@/components/cart/cart-sheet"
import Image from "next/image"
const categories = [
  { name: "Housekeeping Materials", slug: "housekeeping" },
  { name: "Safety Items", slug: "safety" },
  { name: "Account Books", slug: "account-books" },
  { name: "Industrial Supplies", slug: "industrial" },
  { name: "Office Stationery", slug: "office" },
]

export function Header() {
  const { state } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartItemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:9822058336" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">9822058336</span>
            </a>
            <a
              href="mailto:rajyogstationers@gmail.com"
              className="flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span className="hidden sm:inline">rajyogstationers@gmail.com</span>
            </a>
            /
             <a
              href="mailto:contact@rajyogstationers.com"
              className="flex items-center hover:text-accent transition-colors"
            >
              <span className="hidden sm:inline">contact@rajyogstationers.com</span>
            </a>
          </div>
          <Link href="/admin" className="hover:text-accent transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between md:gap-4">
          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 pl-4">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="space-y-2">
                <Link href="/" className="block py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Categories</p>
                  <hr className="w-70" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="block py-2 pl-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <hr className="w-70" />
                </div>
                <Link href="/about" className="block py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="block py-2 text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center md:gap-2">
            <div className="flex justify-center items-center text-primary-foreground px-3 py-2 rounded-lg">
              <Image
                  src="/og-image.png"
                  alt="Rajyog Stationers"
                  width={20}
                  height={20}
                  className="md:h-12 md:w-12 cursor-pointer"
                />
              <span className=" md:text-2xl text-[#8B1E1E] font-bold">RAJYOG</span>
              <span className="text-[#ffcd00] md:text-2xl font-bold">STATIONERS</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
                  }
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Register</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CartSheet>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </CartSheet>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden lg:block bg-secondary border-t border-border">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/" className="block px-4 py-3 font-medium hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-3 font-medium hover:text-primary transition-colors">
                  Products <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/products">All Products</Link>
                  </DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.slug} asChild>
                      <Link href={`/products?category=${cat.slug}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="/dealerships" className="block px-4 py-3 font-medium hover:text-primary transition-colors">
                Dealerships
              </Link>
            </li>
            <li>
              <Link href="/about" className="block px-4 py-3 font-medium hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block px-4 py-3 font-medium hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
