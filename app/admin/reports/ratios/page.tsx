"use client"

import { useState, useEffect } from "react"
import type { FinancialRatios } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, TrendingUp, DollarSign, Percent, BarChart3, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

function RatioCard({
  title,
  value,
  benchmark,
  description,
  isGood,
  suffix = "",
}: {
  title: string
  value: number
  benchmark: string
  description: string
  isGood: boolean
  suffix?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isGood ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
        </div>
        <p className={`text-2xl font-bold ${isGood ? "text-green-600" : "text-amber-600"}`}>
          {value.toFixed(2)}
          {suffix}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Benchmark: {benchmark}</p>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function FinancialRatiosPage() {
  const [report, setReport] = useState<FinancialRatios | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const res = await fetch("/api/accounting/reports?type=ratios")
      const data = await res.json()
      setReport(data.report)
    } catch (error) {
      console.error("Error fetching ratios:", error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthScore = (ratios: FinancialRatios) => {
    let score = 0
    if (ratios.liquidityRatios.currentRatio >= 1.5) score += 20
    else if (ratios.liquidityRatios.currentRatio >= 1) score += 10
    if (ratios.liquidityRatios.quickRatio >= 1) score += 20
    if (ratios.profitabilityRatios.netProfitMargin > 10) score += 20
    else if (ratios.profitabilityRatios.netProfitMargin > 5) score += 10
    if (ratios.leverageRatios.debtToEquity < 1) score += 20
    else if (ratios.leverageRatios.debtToEquity < 2) score += 10
    if (ratios.profitabilityRatios.returnOnEquity > 15) score += 20
    else if (ratios.profitabilityRatios.returnOnEquity > 10) score += 10
    return score
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const healthScore = getHealthScore(report)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Ratios</h1>
          <p className="text-muted-foreground">Key performance indicators for financial health</p>
        </div>
        <Button onClick={fetchReport}>Refresh</Button>
      </div>

      {/* Health Score Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-muted-foreground">Overall Financial Health Score</p>
              <p className="text-5xl font-bold text-primary">{healthScore}/100</p>
            </div>
            <div className="flex-1 w-full">
              <Progress value={healthScore} className="h-4" />
              <div className="flex justify-between text-sm mt-2">
                <span className="text-red-500">Poor</span>
                <span className="text-amber-500">Fair</span>
                <span className="text-green-500">Good</span>
                <span className="text-emerald-500">Excellent</span>
              </div>
            </div>
            <Badge
              variant={healthScore >= 70 ? "default" : healthScore >= 40 ? "secondary" : "destructive"}
              className="text-lg px-4 py-1"
            >
              {healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Fair" : "Needs Attention"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Ratios */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-500" />
          Liquidity Ratios
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <RatioCard
            title="Current Ratio"
            value={report.liquidityRatios.currentRatio}
            benchmark=">= 1.5"
            description="Ability to pay short-term obligations"
            isGood={report.liquidityRatios.currentRatio >= 1.5}
          />
          <RatioCard
            title="Quick Ratio"
            value={report.liquidityRatios.quickRatio}
            benchmark=">= 1.0"
            description="Ability to meet short-term obligations without selling inventory"
            isGood={report.liquidityRatios.quickRatio >= 1}
          />
          <RatioCard
            title="Cash Ratio"
            value={report.liquidityRatios.cashRatio}
            benchmark=">= 0.5"
            description="Ability to pay off current liabilities with cash only"
            isGood={report.liquidityRatios.cashRatio >= 0.5}
          />
        </div>
      </div>

      {/* Profitability Ratios */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Profitability Ratios
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RatioCard
            title="Gross Profit Margin"
            value={report.profitabilityRatios.grossProfitMargin}
            benchmark="> 30%"
            description="Revenue remaining after cost of goods"
            isGood={report.profitabilityRatios.grossProfitMargin > 30}
            suffix="%"
          />
          <RatioCard
            title="Net Profit Margin"
            value={report.profitabilityRatios.netProfitMargin}
            benchmark="> 10%"
            description="Revenue remaining after all expenses"
            isGood={report.profitabilityRatios.netProfitMargin > 10}
            suffix="%"
          />
          <RatioCard
            title="Return on Assets (ROA)"
            value={report.profitabilityRatios.returnOnAssets}
            benchmark="> 5%"
            description="Efficiency in using assets to generate profit"
            isGood={report.profitabilityRatios.returnOnAssets > 5}
            suffix="%"
          />
          <RatioCard
            title="Return on Equity (ROE)"
            value={report.profitabilityRatios.returnOnEquity}
            benchmark="> 15%"
            description="Return generated on shareholders' equity"
            isGood={report.profitabilityRatios.returnOnEquity > 15}
            suffix="%"
          />
        </div>
      </div>

      {/* Leverage Ratios */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Percent className="h-5 w-5 text-amber-500" />
          Leverage Ratios
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <RatioCard
            title="Debt to Equity"
            value={report.leverageRatios.debtToEquity}
            benchmark="< 1.0"
            description="Amount of debt relative to shareholder equity"
            isGood={report.leverageRatios.debtToEquity < 1}
          />
          <RatioCard
            title="Debt Ratio"
            value={report.leverageRatios.debtRatio}
            benchmark="< 0.5"
            description="Proportion of assets financed by debt"
            isGood={report.leverageRatios.debtRatio < 0.5}
          />
          <RatioCard
            title="Equity Ratio"
            value={report.leverageRatios.equityRatio}
            benchmark="> 0.5"
            description="Proportion of assets financed by equity"
            isGood={report.leverageRatios.equityRatio > 0.5}
          />
        </div>
      </div>

      {/* Efficiency Ratios */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          Efficiency Ratios
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <RatioCard
            title="Inventory Turnover"
            value={report.efficiencyRatios.inventoryTurnover}
            benchmark="> 5"
            description="How many times inventory is sold and replaced"
            isGood={report.efficiencyRatios.inventoryTurnover > 5}
            suffix="x"
          />
          <RatioCard
            title="Receivables Turnover"
            value={report.efficiencyRatios.receivablesTurnover}
            benchmark="> 8"
            description="Efficiency in collecting receivables"
            isGood={report.efficiencyRatios.receivablesTurnover > 8}
            suffix="x"
          />
          <RatioCard
            title="Asset Turnover"
            value={report.efficiencyRatios.assetTurnover}
            benchmark="> 1"
            description="Efficiency in using assets to generate revenue"
            isGood={report.efficiencyRatios.assetTurnover > 1}
            suffix="x"
          />
        </div>
      </div>
    </div>
  )
}
