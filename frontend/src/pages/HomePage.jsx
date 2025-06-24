"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import Button from "../components/ui/Button"
import FundCard from "../components/funds/FundCard"
import { Search, Heart, Shield, Award } from "lucide-react"
import axios from "axios"

export default function HomePage() {
  const [featuredFunds, setFeaturedFunds] = useState([])
  const [savedFundIds, setSavedFundIds] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedFunds()
  }, [])

  const fetchFeaturedFunds = async () => {
    try {
      const response = await axios.get("/funds?sortBy=returns1Y&sortOrder=desc&limit=6")
      setFeaturedFunds(response.data.funds)
    } catch (error) {
      console.error("Error fetching featured funds:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToggle = (fundId, isSaved) => {
    setSavedFundIds((prev) => {
      const newSet = new Set(prev)
      if (isSaved) {
        newSet.add(fundId)
      } else {
        newSet.delete(fundId)
      }
      return newSet
    })
  }

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find the perfect mutual funds with our advanced search and filtering system",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Save funds you're interested in and track them in your personal watchlist",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security measures",
    },
    {
      icon: Award,
      title: "Expert Insights",
      description: "Get detailed fund information and performance metrics to make informed decisions",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to MutualFunds</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover, analyze, and track the best mutual funds for your investment journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-black border-white hover:bg-white hover:text-blue-600"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Funds
                </Button>
              </Link>
              <Link to="/saved-funds">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-black border-white hover:bg-white hover:text-blue-600"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  View Saved Funds
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p className="text-gray-600 text-lg">Everything you need to make smart investment decisions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Funds Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Performing Funds</h2>
            <p className="text-gray-600">Discover funds with excellent recent performance</p>
          </div>
          <Link to="/search">
            <Button variant="outline">View All Funds</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFunds.map((fund) => (
              <FundCard
                key={fund.fundId}
                fund={fund}
                isSaved={savedFundIds.has(fund.fundId)}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Mutual Funds</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Fund Houses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Market Data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
