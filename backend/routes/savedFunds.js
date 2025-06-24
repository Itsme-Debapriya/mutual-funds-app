const express = require("express")
const SavedFund = require("../models/SavedFund")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user's saved funds
router.get("/", auth, async (req, res) => {
  try {
    const savedFunds = await SavedFund.find({ userId: req.user._id }).sort({ createdAt: -1 })

    res.json({ savedFunds })
  } catch (error) {
    console.error("Get saved funds error:", error)
    res.status(500).json({ message: "Server error while fetching saved funds" })
  }
})

// Save a fund
router.post("/", auth, async (req, res) => {
  try {
    const { fund } = req.body

    if (!fund || !fund.fundId) {
      return res.status(400).json({ message: "Fund data is required" })
    }

    // Check if fund is already saved
    const existingSavedFund = await SavedFund.findOne({
      userId: req.user._id,
      fundId: fund.fundId,
    })

    if (existingSavedFund) {
      return res.status(409).json({ message: "Fund already saved" })
    }

    // Create new saved fund
    const savedFund = new SavedFund({
      userId: req.user._id,
      fundId: fund.fundId,
      fundName: fund.name,
      fundCategory: fund.category,
      nav: fund.nav,
      expenseRatio: fund.expenseRatio,
      aum: fund.aum,
      fundManager: fund.fundManager,
      fundHouse: fund.fundHouse,
    })

    await savedFund.save()

    res.status(201).json({
      message: "Fund saved successfully",
      savedFund,
    })
  } catch (error) {
    console.error("Save fund error:", error)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Fund already saved" })
    }
    res.status(500).json({ message: "Server error while saving fund" })
  }
})

// Remove a saved fund
router.delete("/:fundId", auth, async (req, res) => {
  try {
    const { fundId } = req.params

    const deletedFund = await SavedFund.findOneAndDelete({
      userId: req.user._id,
      fundId: fundId,
    })

    if (!deletedFund) {
      return res.status(404).json({ message: "Saved fund not found" })
    }

    res.json({ message: "Fund removed successfully" })
  } catch (error) {
    console.error("Remove saved fund error:", error)
    res.status(500).json({ message: "Server error while removing saved fund" })
  }
})

module.exports = router
