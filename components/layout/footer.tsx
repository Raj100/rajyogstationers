import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"
export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex mb-4 justify-center items-center">
              <Link href="/">
                <Image
                  src="/og-image.png"
                  alt="Rajyog Stationers"
                  width={20}
                  height={20}
                  className="h-12 w-12 cursor-pointer"
                />
              </Link>
              <span className="text-2xl font-bold">Rajyog</span>
              <span className="text-[#ffcd00] font-bold text-2xl">STATIONERS</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Your trusted partner for quality stationery, housekeeping materials, safety items, and industrial supplies
              since 1995.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>9822058336, 7038978888</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span>rajyogstationers@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="!h-12 !w-12 text-accent mt-0.5" />
                <div>
                  <span>C-270, Udhyog Bharti Estate,</span>
                  <span>Chhatrapati Sambhaji Maharaj Nagar (formerly Aurangabad) - 431136</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-accent transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/dealerships" className="hover:text-accent transition-colors">
                  Our Dealerships
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=housekeeping" className="hover:text-accent transition-colors">
                  Housekeeping Materials
                </Link>
              </li>
              <li>
                <Link href="/products?category=safety" className="hover:text-accent transition-colors">
                  Safety Items
                </Link>
              </li>
              <li>
                <Link href="/products?category=account-books" className="hover:text-accent transition-colors">
                  Account Books
                </Link>
              </li>
              <li>
                <Link href="/products?category=industrial" className="hover:text-accent transition-colors">
                  Industrial Supplies
                </Link>
              </li>
              <li>
                <Link href="/products?category=office" className="hover:text-accent transition-colors">
                  Office Stationery
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Business Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Monday - Saturday</span>
                <span>9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 AM - 6:00 PM</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">We Accept</h4>
              <div className="flex gap-2">
                <div className="bg-primary-foreground/10 px-3 py-1 rounded text-sm">Cash</div>
                <div className="bg-primary-foreground/10 px-3 py-1 rounded text-sm">UPI</div>
                <div className="bg-primary-foreground/10 px-3 py-1 rounded text-sm">Cards</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Rajyog Stationers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
