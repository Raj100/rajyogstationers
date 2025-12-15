import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Shield,
  BookOpen,
  Wrench,
  FileText,
  Truck,
  BadgeCheck,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react"

const categories = [
  {
    name: "Housekeeping Materials",
    slug: "housekeeping",
    description: "Quality cleaning supplies and essentials",
    icon: Package,
    color: "bg-blue-500",
  },
  {
    name: "Safety Items",
    slug: "safety",
    description: "Protective gear and safety equipment",
    icon: Shield,
    color: "bg-amber-500",
  },
  {
    name: "Account Books",
    slug: "account-books",
    description: "Ledgers, registers and journals",
    icon: BookOpen,
    color: "bg-emerald-500",
  },
  {
    name: "Industrial Supplies",
    slug: "industrial",
    description: "Tools and industrial equipment",
    icon: Wrench,
    color: "bg-orange-500",
  },
  {
    name: "Office Stationery",
    slug: "office",
    description: "Pens, papers and office essentials",
    icon: FileText,
    color: "bg-indigo-500",
  },
]

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick delivery across Gujarat",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assured",
    description: "Only genuine products",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Always here to help",
  },
]

const dealerships = [
  "Camlin Products",
  "Kores India",
  "Cello Writing",
  "Luxor Pens",
  "Pidilite Industries",
  "Asian Paints",
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-yellow-swirls.png')] opacity-30" />
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="max-w-3xl">
              <Badge className="bg-accent text-accent-foreground mb-4">Trusted Since 1995</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 text-balance">
                Your One-Stop Shop for Quality Supplies
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 text-pretty">
                Housekeeping materials, safety items, account books, and industrial supplies. Quality products at
                competitive prices for businesses across India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/products">
                    Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-secondary border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our wide range of products across different categories
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link key={category.slug} href={`/products?category=${category.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dealerships Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Authorized Dealerships</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We are proud authorized dealers for leading brands in India
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {dealerships.map((brand) => (
                <div
                  key={brand}
                  className="bg-background px-8 py-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <span className="font-semibold text-lg">{brand}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/dealerships">
                  View All Dealerships <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 inset-0 bg-[url('/abstract-yellow-red-swirls.png')] ">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Need Bulk Orders?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Get special discounts on bulk orders. Contact us for custom quotes and personalized service for your
              business needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                <a href="tel:9822058336">Call Now</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
