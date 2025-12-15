import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Clock, Shield, Truck } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description: "We source only genuine products from authorized dealers and reputable manufacturers.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Building lasting relationships through exceptional service and personalized attention.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description: "On-time delivery across Gujarat with efficient logistics and inventory management.",
  },
  {
    icon: Award,
    title: "Competitive Pricing",
    description: "Best prices in the market without compromising on product quality.",
  },
]

const milestones = [
  { year: "1995", event: "Rajyog Stationers founded in Anand" },
  { year: "2000", event: "Expanded to industrial supplies" },
  { year: "2005", event: "Became authorized Camlin dealer" },
  { year: "2010", event: "Added safety equipment division" },
  { year: "2015", event: "Expanded warehouse facilities" },
  { year: "2020", event: "Launched online presence" },
  { year: "2024", event: "Serving 500+ businesses" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 inset-0 bg-[url('/abstract-yellow-swirls.png')] ">
          <div className="container mx-auto px-4 text-center">
            <Badge className="bg-accent text-accent-foreground mb-4">Since 1995</Badge>
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">About Rajyog Stationers</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Your trusted partner for quality office supplies, housekeeping materials, safety equipment, and industrial
              products across Gujarat.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 1995, Rajyog Stationers began as a small stationery shop in Anand, Gujarat. Over the years,
                  we have grown into a comprehensive supplier of office supplies, housekeeping materials, safety
                  equipment, and industrial products.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our commitment to quality and customer service has earned us the trust of over 500 businesses,
                  schools, hospitals, and government offices across Gujarat.
                </p>
                <p className="text-muted-foreground">
                  Today, we are proud authorized dealers for leading brands like Camlin, Kores, Cello, Luxor, and many
                  more, ensuring our customers always receive genuine, high-quality products.
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-4xl font-bold text-primary">29+</p>
                      <p className="text-muted-foreground">Years of Experience</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-4xl font-bold text-primary">500+</p>
                      <p className="text-muted-foreground">Happy Clients</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-4xl font-bold text-primary">5000+</p>
                      <p className="text-muted-foreground">Products</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-4xl font-bold text-primary">20+</p>
                      <p className="text-muted-foreground">Brand Partners</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do at Rajyog Stationers
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="pt-6 text-center">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-muted-foreground">Key milestones in our growth story</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-primary/20 -translate-x-1/2" />
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative flex items-center mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"} pl-12 md:pl-0`}>
                      <p className="text-primary font-bold">{milestone.year}</p>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </div>
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 border-4 border-background" />
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <Target className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-primary-foreground/80">
                  To be the most trusted supplier of quality office, industrial, and housekeeping products in Gujarat,
                  delivering exceptional value and service to every customer.
                </p>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <Clock className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-primary-foreground/80">
                  To expand our reach across Western India while maintaining the personalized service and product
                  quality that our customers have trusted for decades.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
