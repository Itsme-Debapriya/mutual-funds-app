"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { ArrowLeft, TrendingUp, User, Building, Target, AlertTriangle, PieChart, Heart, Loader2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

export default function FundDetailsPage() {
  const [fund, setFund] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchFundDetails()
    }
  }, [id])

  const fetchFundDetails = async () => {
    try {
      const response = await axios.get(`/funds/${id}`)
      setFund(response.data.fund)
    } catch (error) {
      console.error("Error fetching fund details:", error)
      if (error.response?.status === 404) {
        toast.error("Fund not found")
        navigate("/search")
      } else {
        toast.error("Failed to load fund details")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToggle = async () => {
    if (!fund) return

    setIsSaving(true)
    try {
      if (isSaved) {
        await axios.delete(`/saved-funds/${fund.fundId}`)
        setIsSaved(false)
        toast.success(`${fund.name} removed from saved funds`)
      } else {
        await axios.post("/saved-funds", { fund })
        setIsSaved(true)
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
      setIsSaving(false)
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
      month: "long",
      day: "numeric",
    })
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Very High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!fund) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Fund not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{fund.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline">{fund.category}</Badge>
              <Badge variant="outline">{fund.subCategory}</Badge>
              <Badge className={getRiskColor(fund.riskRating)}>{fund.riskRating} Risk</Badge>
            </div>
            <p className="text-gray-600">{fund.fundHouse}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Current NAV</p>
              <p className="text-2xl font-bold text-gray-900">₹{fund.nav.toFixed(2)}</p>
            </div>
            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={handleSaveToggle}
              disabled={isSaving}
              className={isSaved ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              )}
              <span className="ml-2">{isSaved ? "Saved" : "Save"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Expense Ratio</p>
                  <p className="text-lg font-semibold">{(fund.expenseRatio * 100).toFixed(2)}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">AUM</p>
                  <p className="text-lg font-semibold">{formatCurrency(fund.aum)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Min Investment</p>
                  <p className="text-lg font-semibold">₹{fund.minInvestment}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Exit Load</p>
                  <p className="text-lg font-semibold text-center">{fund.exitLoad}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Returns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Historical Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fund.returns1Y && (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">1 Year</p>
                    <p className={`text-xl font-bold ${fund.returns1Y >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fund.returns1Y.toFixed(1)}%
                    </p>
                  </div>
                )}
                {fund.returns3Y && (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">3 Years</p>
                    <p className={`text-xl font-bold ${fund.returns3Y >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fund.returns3Y.toFixed(1)}%
                    </p>
                  </div>
                )}
                {fund.returns5Y && (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">5 Years</p>
                    <p className={`text-xl font-bold ${fund.returns5Y >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fund.returns5Y.toFixed(1)}%
                    </p>
                  </div>
                )}
                {fund.returns10Y && (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">10 Years</p>
                    <p className={`text-xl font-bold ${fund.returns10Y >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fund.returns10Y.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investment Objective */}
          {fund.investmentObjective && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Investment Objective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{fund.investmentObjective}</p>
              </CardContent>
            </Card>
          )}

          {/* Top Holdings */}
          {fund.holdings && fund.holdings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Top Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fund.holdings.map((holding, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{holding.company}</span>
                      <span className="font-semibold">{holding.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Fund Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Fund Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-gray-900">{fund.fundManager}</p>
              <p className="text-sm text-gray-600 mt-1">{fund.fundHouse}</p>
            </CardContent>
          </Card>

          {/* Fund Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Fund Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Inception Date</span>
                <span className="font-medium">{formatDate(fund.inceptionDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Benchmark</span>
                <span className="font-medium text-right">{fund.benchmark}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fund House</span>
                <span className="font-medium">{fund.fundHouse}</span>
              </div>
            </CardContent>
          </Card>

          {/* Risk Warning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Risk Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Mutual fund investments are subject to market risks. Please read all scheme related documents carefully
                before investing. Past performance is not indicative of future results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
