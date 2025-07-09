"use client"

import { useState, useEffect } from "react"
import FundCard from "../components/funds/FundCard"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { Search, Filter, X } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

export default function SearchPage() {
  const [funds, setFunds] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedFundIds, setSavedFundIds] = useState(new Set())
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    fundHouse: "all",
    riskRating: "all",
    sortBy: "name",
    sortOrder: "asc",
  })
  const [categories, setCategories] = useState([])
  const [fundHouses, setFundHouses] = useState([])
  const [riskRatings, setRiskRatings] = useState([])

  useEffect(() => {
    fetchMetadata()
    searchFunds()
  }, [])

  const fetchMetadata = async () => {
    try {
      const response = await axios.get("/funds/meta/categories")
      setCategories(response.data.categories)
      setFundHouses(response.data.fundHouses)
      setRiskRatings(response.data.riskRatings)
    } catch (error) {
      console.error("Error fetching metadata:", error)
    }
  }

  const searchFunds = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value)
        }
      })

      const response = await axios.get(`/funds?${queryParams}`)
      setFunds(response.data.funds || [])
    } catch (error) {
      console.error("Error searching funds:", error)
      toast.error("Failed to search funds. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      fundHouse: "all",
      riskRating: "all",
      sortBy: "name",
      sortOrder: "asc",
    })
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

  const hasActiveFilters =
    filters.search ||
    (filters.category && filters.category !== "all") ||
    (filters.fundHouse && filters.fundHouse !== "all") ||
    (filters.riskRating && filters.riskRating !== "all")

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Mutual Funds</h1>
        <p className="text-gray-600">Find the perfect mutual funds for your investment portfolio</p>
      </div>

      <div className="space-y-6">
        {/* Search Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Search & Filter</h3>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Funds
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Search by fund name, house, or manager..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fund House</label>
              <select
                value={filters.fundHouse}
                onChange={(e) => handleFilterChange("fundHouse", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Fund Houses</option>
                {fundHouses.map((house) => (
                  <option key={house} value={house}>
                    {house}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Risk Rating</label>
              <select
                value={filters.riskRating}
                onChange={(e) => handleFilterChange("riskRating", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Risk Levels</option>
                {riskRatings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <div className="flex space-x-2 mt-1">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="nav">NAV</option>
                  <option value="returns1Y">1Y Returns</option>
                  <option value="returns3Y">3Y Returns</option>
                  <option value="expenseRatio">Expense Ratio</option>
                  <option value="aum">AUM</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                  className="w-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">↑</option>
                  <option value="desc">↓</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end">
            <Button onClick={searchFunds} className="px-8">
              <Search className="h-4 w-4 mr-2" />
              Search Funds
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <span className="ml-2 text-gray-600">Searching funds...</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found {funds.length} fund{funds.length !== 1 ? "s" : ""}
              </p>
            </div>

            {funds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {funds.map((fund) => (
                  <FundCard
                    key={fund.fundId}
                    fund={fund}
                    isSaved={savedFundIds.has(fund.fundId)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No funds found matching your criteria</p>
                <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
