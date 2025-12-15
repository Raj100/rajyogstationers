import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const dealerships = [
  {
    name: "Camlin",
    category: "Stationery & Art Supplies",
    products: ["Pens", "Markers", "Art Colors", "Brushes", "Notebooks"],
    since: "2005",
  },
  {
    name: "Kores India",
    category: "Office Supplies",
    products: ["Adhesives", "Correction Fluid", "Stamps", "Ink Pads", "Files"],
    since: "2003",
  },
  {
    name: "Cello Writing",
    category: "Writing Instruments",
    products: ["Ball Pens", "Gel Pens", "Fountain Pens", "Refills"],
    since: "2008",
  },
  {
    name: "Luxor",
    category: "Premium Writing",
    products: ["Premium Pens", "Highlighters", "Permanent Markers", "OHP Markers"],
    since: "2010",
  },
  {
    name: "Pidilite",
    category: "Adhesives & Sealants",
    products: ["Fevicol", "Fevistik", "M-Seal", "Dr. Fixit", "Industrial Adhesives"],
    since: "2000",
  },
  {
    name: "3M India",
    category: "Safety & Industrial",
    products: ["Safety Masks", "Ear Plugs", "Safety Glasses", "Tapes", "Abrasives"],
    since: "2012",
  },
  {
    name: "Godrej",
    category: "Housekeeping",
    products: ["Air Fresheners", "Cleaning Products", "Industrial Chemicals"],
    since: "2015",
  },
  {
    name: "Supreme Industries",
    category: "Plastic Products",
    products: ["Dustbins", "Crates", "Buckets", "Storage Solutions"],
    since: "2011",
  },
]

export default function DealershipsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">Our Authorized Dealerships</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              We are proud to be authorized dealers for some of India's most trusted brands, ensuring you always receive
              genuine, high-quality products.
            </p>
          </div>
        </section>

        {/* Dealerships Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealerships.map((dealer) => (
                <Card key={dealer.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{dealer.name}</h3>
                      <Badge variant="secondary">Since {dealer.since}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{dealer.category}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Products:</p>
                      <ul className="space-y-1">
                        {dealer.products.slice(0, 4).map((product) => (
                          <li key={product} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {product}
                          </li>
                        ))}
                        {dealer.products.length > 4 && (
                          <li className="text-sm text-muted-foreground">+{dealer.products.length - 4} more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Looking for Specific Products?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Contact us and we'll source it from our extensive network of suppliers
              and manufacturers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:02462591118"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Call: 0246-2591118
              </a>
              <a
                href="mailto:rajyogstationers@gmail.com"
                className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
