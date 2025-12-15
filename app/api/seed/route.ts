import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { categories, products, accounts, customers } from "@/lib/db/seed-data"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Clear existing data
    await db.collection("categories").deleteMany({})
    await db.collection("products").deleteMany({})
    await db.collection("accounts").deleteMany({})
    await db.collection("customers").deleteMany({})

    // Insert categories
    const categoryDocs = categories.map((cat) => ({
      ...cat,
      _id: undefined,
    }))
    await db.collection("categories").insertMany(categoryDocs)

    // Insert products
    const productDocs = products.map((prod) => ({
      ...prod,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    await db.collection("products").insertMany(productDocs)

    // Insert accounts
    const accountDocs = accounts.map((acc) => ({
      ...acc,
      createdAt: new Date(),
    }))
    await db.collection("accounts").insertMany(accountDocs)

    // Insert customers
    const customerDocs = customers.map((cust) => ({
      ...cust,
      createdAt: new Date(),
    }))
    await db.collection("customers").insertMany(customerDocs)

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        categories: categories.length,
        products: products.length,
        accounts: accounts.length,
        customers: customers.length,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
