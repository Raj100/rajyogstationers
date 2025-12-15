import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import type { TrialBalance, BalanceSheet, ProfitLoss, FinancialRatios } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const reportType = searchParams.get("type")
    const asOfDate = searchParams.get("asOfDate") ? new Date(searchParams.get("asOfDate")!) : new Date()
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : new Date(asOfDate.getFullYear(), 0, 1)
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : asOfDate

    const accounts = await db.collection("accounts").find({ isActive: true }).toArray()

    switch (reportType) {
      case "trial-balance": {
        const trialBalance: TrialBalance = {
          accounts: accounts.map((acc) => ({
            accountId: acc._id.toString(),
            accountCode: acc.code,
            accountName: acc.name,
            accountType: acc.type,
            debit:
              acc.balance > 0 && ["asset", "expense"].includes(acc.type)
                ? acc.balance
                : acc.balance < 0 && ["liability", "equity", "revenue"].includes(acc.type)
                  ? Math.abs(acc.balance)
                  : 0,
            credit:
              acc.balance > 0 && ["liability", "equity", "revenue"].includes(acc.type)
                ? acc.balance
                : acc.balance < 0 && ["asset", "expense"].includes(acc.type)
                  ? Math.abs(acc.balance)
                  : 0,
          })),
          totalDebit: 0,
          totalCredit: 0,
          asOfDate,
        }

        trialBalance.totalDebit = trialBalance.accounts.reduce((sum, acc) => sum + acc.debit, 0)
        trialBalance.totalCredit = trialBalance.accounts.reduce((sum, acc) => sum + acc.credit, 0)

        return NextResponse.json({ report: trialBalance })
      }

      case "balance-sheet": {
        const assets = accounts.filter((a) => a.type === "asset")
        const liabilities = accounts.filter((a) => a.type === "liability")
        const equity = accounts.filter((a) => a.type === "equity")

        const balanceSheet: BalanceSheet = {
          asOfDate,
          assets: {
            items: assets.map((a) => ({
              accountId: a._id.toString(),
              accountCode: a.code,
              accountName: a.name,
              balance: a.balance,
            })),
            total: assets.reduce((sum, a) => sum + a.balance, 0),
          },
          liabilities: {
            items: liabilities.map((a) => ({
              accountId: a._id.toString(),
              accountCode: a.code,
              accountName: a.name,
              balance: a.balance,
            })),
            total: liabilities.reduce((sum, a) => sum + a.balance, 0),
          },
          equity: {
            items: equity.map((a) => ({
              accountId: a._id.toString(),
              accountCode: a.code,
              accountName: a.name,
              balance: a.balance,
            })),
            total: equity.reduce((sum, a) => sum + a.balance, 0),
          },
          totalAssets: assets.reduce((sum, a) => sum + a.balance, 0),
          totalLiabilities: liabilities.reduce((sum, a) => sum + a.balance, 0),
          totalEquity: equity.reduce((sum, a) => sum + a.balance, 0),
        }

        return NextResponse.json({ report: balanceSheet })
      }

      case "profit-loss": {
        const revenue = accounts.filter((a) => a.type === "revenue")
        const expenses = accounts.filter((a) => a.type === "expense")
        const cogs = accounts.find((a) => a.code === "5000")

        const totalRevenue = revenue.reduce((sum, a) => sum + Math.abs(a.balance), 0)
        const totalExpenses = expenses.reduce((sum, a) => sum + Math.abs(a.balance), 0)
        const grossProfit = totalRevenue - (cogs?.balance || 0)

        const profitLoss: ProfitLoss = {
          startDate,
          endDate,
          revenue: {
            items: revenue.map((a) => ({
              accountId: a._id.toString(),
              accountCode: a.code,
              accountName: a.name,
              amount: Math.abs(a.balance),
            })),
            total: totalRevenue,
          },
          expenses: {
            items: expenses.map((a) => ({
              accountId: a._id.toString(),
              accountCode: a.code,
              accountName: a.name,
              amount: Math.abs(a.balance),
            })),
            total: totalExpenses,
          },
          totalRevenue,
          totalExpenses,
          grossProfit,
          netProfit: totalRevenue - totalExpenses,
        }

        return NextResponse.json({ report: profitLoss })
      }

      case "ratios": {
        const cash = accounts.find((a) => a.code === "1000")?.balance || 0
        const bank = accounts.find((a) => a.code === "1010")?.balance || 0
        const receivables = accounts.find((a) => a.code === "1100")?.balance || 0
        const inventory = accounts.find((a) => a.code === "1200")?.balance || 0
        const prepaid = accounts.find((a) => a.code === "1300")?.balance || 0

        const currentAssets = cash + bank + receivables + inventory + prepaid
        const currentLiabilities = accounts
          .filter((a) => a.type === "liability" && a.subtype === "current")
          .reduce((sum, a) => sum + a.balance, 0)

        const totalAssets = accounts.filter((a) => a.type === "asset").reduce((sum, a) => sum + a.balance, 0)

        const totalLiabilities = accounts.filter((a) => a.type === "liability").reduce((sum, a) => sum + a.balance, 0)

        const totalEquity = accounts.filter((a) => a.type === "equity").reduce((sum, a) => sum + a.balance, 0)

        const revenue = accounts.filter((a) => a.type === "revenue").reduce((sum, a) => sum + Math.abs(a.balance), 0)

        const expenses = accounts.filter((a) => a.type === "expense").reduce((sum, a) => sum + Math.abs(a.balance), 0)

        const netProfit = revenue - expenses
        const cogs = accounts.find((a) => a.code === "5000")?.balance || 0
        const grossProfit = revenue - cogs

        const ratios: FinancialRatios = {
          liquidityRatios: {
            currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
            quickRatio: currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0,
            cashRatio: currentLiabilities > 0 ? (cash + bank) / currentLiabilities : 0,
          },
          profitabilityRatios: {
            grossProfitMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
            netProfitMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
            returnOnAssets: totalAssets > 0 ? (netProfit / totalAssets) * 100 : 0,
            returnOnEquity: totalEquity > 0 ? (netProfit / totalEquity) * 100 : 0,
          },
          leverageRatios: {
            debtToEquity: totalEquity > 0 ? totalLiabilities / totalEquity : 0,
            debtRatio: totalAssets > 0 ? totalLiabilities / totalAssets : 0,
            equityRatio: totalAssets > 0 ? totalEquity / totalAssets : 0,
          },
          efficiencyRatios: {
            inventoryTurnover: inventory > 0 ? cogs / inventory : 0,
            receivablesTurnover: receivables > 0 ? revenue / receivables : 0,
            assetTurnover: totalAssets > 0 ? revenue / totalAssets : 0,
          },
        }

        return NextResponse.json({ report: ratios })
      }

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
