"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import { Trash2, TrendingUp, DollarSign, User, Calendar } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

export default function SavedFundsPage() {
  const [savedFunds, setSavedFunds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingFundId, setRemovingFundId] = useState(null)

  useEffect(() => {
    fetchSavedFunds()
  }, [])

  const fetchSavedFunds = async () => {
    try {
      const response = await axios.get("/saved-funds")
      setSavedFunds(response.data.savedFunds || [])
    } catch (error) {
      console.error("Error fetching saved funds:", error)
      toast.error("Failed to load saved funds")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFund = async (fundId) => {
    setRemovingFundId(fundId)

    try {
      await axios.delete(`/saved-funds/${fundId}`)
      setSavedFunds((prev) => prev.filter((fund) => fund.fundId !== fundId))
      toast.success("Fund removed from saved funds")
    } catch (error) {
      console.error("Error removing fund:", error)
      toast.error("Failed to remove fund")
    } finally {
      setRemovingFundId(null)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (savedFunds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved funds yet</h3>
            <p className="text-gray-500 text-center">
              Start exploring mutual funds and save the ones you're interested in to see them here.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Saved Funds</h2>
          <Badge variant="secondary" className="text-sm">
            {savedFunds.length} {savedFunds.length === 1 ? "fund" : "funds"} saved
          </Badge>
        </div>

        <div className="grid gap-4">
          {savedFunds.map((fund) => (
            <Card key={fund._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{fund.fundName}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {fund.fundCategory}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFund(fund.fundId)}
                    disabled={removingFundId === fund.fundId}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">NAV</p>
                      <p className="font-semibold">₹{fund.nav?.toFixed(2)}</p>
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
                    <TrendingUp className="h-4 w-4 text-purple-500" />
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

                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Saved on {formatDate(fund.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
