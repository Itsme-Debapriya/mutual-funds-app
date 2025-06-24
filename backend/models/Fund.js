const mongoose = require("mongoose")

const fundSchema = new mongoose.Schema(
  {
    fundId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Fund name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Equity", "Debt", "Hybrid", "Index", "ELSS"],
    },
    subCategory: {
      type: String,
      required: true,
    },
    nav: {
      type: Number,
      required: [true, "NAV is required"],
      min: [0, "NAV cannot be negative"],
    },
    expenseRatio: {
      type: Number,
      required: [true, "Expense ratio is required"],
      min: [0, "Expense ratio cannot be negative"],
      max: [5, "Expense ratio seems too high"],
    },
    aum: {
      type: Number,
      required: [true, "AUM is required"],
      min: [0, "AUM cannot be negative"],
    },
    fundManager: {
      type: String,
      required: [true, "Fund manager is required"],
      trim: true,
    },
    fundHouse: {
      type: String,
      required: [true, "Fund house is required"],
      trim: true,
    },
    inceptionDate: {
      type: Date,
      required: true,
    },
    returns1Y: Number,
    returns3Y: Number,
    returns5Y: Number,
    returns10Y: Number,
    riskRating: {
      type: String,
      enum: ["Low", "Moderate", "High", "Very High"],
      required: true,
    },
    minInvestment: {
      type: Number,
      required: true,
      min: [100, "Minimum investment cannot be less than 100"],
    },
    exitLoad: {
      type: String,
      required: true,
    },
    benchmark: {
      type: String,
      required: true,
    },
    description: String,
    investmentObjective: String,
    holdings: [
      {
        company: String,
        percentage: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Create indexes for better search performance
fundSchema.index({ name: "text", fundHouse: "text", fundManager: "text" })
fundSchema.index({ category: 1 })
fundSchema.index({ fundHouse: 1 })
fundSchema.index({ riskRating: 1 })

module.exports = mongoose.model("Fund", fundSchema)
