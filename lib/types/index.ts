// Product Types
export interface Product {
  _id: string
  name: string
  description: string
  category: string
  subcategory?: string
  price: number
  costPrice: number
  quantity: number
  minStock: number
  unit: string
  sku: string
  images: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Customer Types
export interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  address: Address
  gstNumber?: string
  creditLimit: number
  balance: number
  createdAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
  country: string
}

// Order Types
export interface Order {
  _id: string
  orderNumber: string
  customerId: string
  customer?: Customer
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "partial" | "paid"
  paymentMethod?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  product?: Product
  name: string
  quantity: number
  price: number
  total: number
}

// Invoice Types
export interface Invoice {
  _id: string
  invoiceNumber: string
  orderId?: string
  customerId: string
  customer?: Customer
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  taxRate: number
  discount: number
  total: number
  amountPaid: number
  balance: number
  status: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled"
  dueDate: Date
  notes?: string
  terms?: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  productId?: string
  description: string
  quantity: number
  rate: number
  amount: number
}

// Accounting Types
export interface JournalEntry {
  _id: string
  entryNumber: string
  date: Date
  description: string
  entries: JournalLine[]
  totalDebit: number
  totalCredit: number
  isPosted: boolean
  createdBy?: string
  createdAt: Date
}

export interface JournalLine {
  accountId: string
  accountName: string
  accountCode: string
  debit: number
  credit: number
  narration?: string
}

export interface Account {
  _id: string
  code: string
  name: string
  type: "asset" | "liability" | "equity" | "revenue" | "expense"
  subtype: string
  balance: number
  isActive: boolean
  parentId?: string
  createdAt: Date
}

export interface LedgerEntry {
  _id: string
  accountId: string
  journalEntryId: string
  date: Date
  description: string
  debit: number
  credit: number
  balance: number
  createdAt: Date
}

// Financial Report Types
export interface TrialBalance {
  accounts: TrialBalanceAccount[]
  totalDebit: number
  totalCredit: number
  asOfDate: Date
}

export interface TrialBalanceAccount {
  accountId: string
  accountCode: string
  accountName: string
  accountType: string
  debit: number
  credit: number
}

export interface BalanceSheet {
  asOfDate: Date
  assets: BalanceSheetSection
  liabilities: BalanceSheetSection
  equity: BalanceSheetSection
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
}

export interface BalanceSheetSection {
  items: BalanceSheetItem[]
  total: number
}

export interface BalanceSheetItem {
  accountId: string
  accountCode: string
  accountName: string
  balance: number
}

export interface ProfitLoss {
  startDate: Date
  endDate: Date
  revenue: ProfitLossSection
  expenses: ProfitLossSection
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  grossProfit: number
}

export interface ProfitLossSection {
  items: ProfitLossItem[]
  total: number
}

export interface ProfitLossItem {
  accountId: string
  accountCode: string
  accountName: string
  amount: number
}

// Financial Ratios
export interface FinancialRatios {
  liquidityRatios: {
    currentRatio: number
    quickRatio: number
    cashRatio: number
  }
  profitabilityRatios: {
    grossProfitMargin: number
    netProfitMargin: number
    returnOnAssets: number
    returnOnEquity: number
  }
  leverageRatios: {
    debtToEquity: number
    debtRatio: number
    equityRatio: number
  }
  efficiencyRatios: {
    inventoryTurnover: number
    receivablesTurnover: number
    assetTurnover: number
  }
}

// Cart Types
export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
}

// Category Types
export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
}
