"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import Badge from "../ui/Badge"
import Button from "../ui/Button"
import { TrendingUp, DollarSign, User, Building, Heart, Loader2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

export default function FundCard({ fund, isSaved = false, onSaveToggle }) {
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(isSaved)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSaveToggle = async () => {
    setIsLoading(true)

    try {
      if (saved) {
        // Remove from saved funds
        await axios.delete(`/saved-funds/${fund.fundId}`)
        setSaved(false)
        onSaveToggle?.(fund.fundId, false)
        toast.success(`${fund.name} removed from saved funds`)
      } else {
        // Add to saved funds
        await axios.post("/saved-funds", { fund })
        setSaved(true)
        onSaveToggle?.(fund.fundId, true)
        toast.success(`${fund.name} added to saved funds`)
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      if (error.response?.status === 409) {
        toast.error("Fund already saved")
      } else {
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              <Link to={`/funds/${fund.fundId}`} className="hover:text-blue-600 transition-colors">
                {fund.name}
              </Link>
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {fund.category}
            </Badge>
          </div>
          <Button
            variant={saved ? "default" : "outline"}
            size="sm"
            onClick={handleSaveToggle}
            disabled={isLoading}
            className={saved ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            )}
            <span className="ml-2">{saved ? "Saved" : "Save"}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">NAV</p>
              <p className="font-semibold">₹{fund.nav.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Expense Ratio</p>
              <p className="font-semibold">{(fund.expenseRatio * 100).toFixed(2)}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">AUM</p>
              <p className="font-semibold">{formatCurrency(fund.aum)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Fund Manager</p>
              <p className="font-semibold text-sm">{fund.fundManager}</p>
            </div>
          </div>
        </div>

        {(fund.returns1Y || fund.returns3Y || fund.returns5Y) && (
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500 mb-2">Returns</p>
            <div className="flex space-x-4 text-sm">
              {fund.returns1Y && (
                <div>
                  <span className="text-gray-500">1Y: </span>
                  <span className={`font-semibold ${fund.returns1Y >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {fund.returns1Y.toFixed(1)}%
                  </span>
                </div>
              )}
              {fund.returns3Y && (
                <div>
                  <span className="text-gray-500">3Y: </span>
                  <span className={`font-semibold ${fund.returns3Y >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {fund.returns3Y.toFixed(1)}%
                  </span>
                </div>
              )}
              {fund.returns5Y && (
                <div>
                  <span className="text-gray-500">5Y: </span>
                  <span className={`font-semibold ${fund.returns5Y >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {fund.returns5Y.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
