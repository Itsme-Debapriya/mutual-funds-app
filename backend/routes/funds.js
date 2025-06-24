const express = require("express")
const Fund = require("../models/Fund")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all funds with search and filters
router.get("/", auth, async (req, res) => {
  try {
    const {
      search,
      category,
      fundHouse,
      riskRating,
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 20,
    } = req.query

    // Build query
    const query = {}

    // Text search
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category
    }

    // Fund house filter
    if (fundHouse && fundHouse !== "all") {
      query.fundHouse = fundHouse
    }

    // Risk rating filter
    if (riskRating && riskRating !== "all") {
      query.riskRating = riskRating
    }

    // Build sort object
    const sortObj = {}
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1

    // Execute query with pagination
    const funds = await Fund.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    // Get total count for pagination
    const total = await Fund.countDocuments(query)

    res.json({
      funds,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get funds error:", error)
    res.status(500).json({ message: "Server error while fetching funds" })
  }
})

// Get single fund by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const fund = await Fund.findOne({ fundId: req.params.id })

    if (!fund) {
      return res.status(404).json({ message: "Fund not found" })
    }

    res.json({ fund })
  } catch (error) {
    console.error("Get fund error:", error)
    res.status(500).json({ message: "Server error while fetching fund" })
  }
})

// Get fund categories
router.get("/meta/categories", auth, async (req, res) => {
  try {
    const categories = await Fund.distinct("category")
    const fundHouses = await Fund.distinct("fundHouse")
    const riskRatings = await Fund.distinct("riskRating")

    res.json({
      categories,
      fundHouses,
      riskRatings,
    })
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ message: "Server error while fetching categories" })
  }
})

module.exports = router
