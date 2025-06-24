const mongoose = require("mongoose")

const savedFundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fundId: {
      type: String,
      required: true,
    },
    fundName: {
      type: String,
      required: true,
    },
    fundCategory: String,
    nav: Number,
    expenseRatio: Number,
    aum: Number,
    fundManager: String,
    fundHouse: String,
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure user can't save the same fund twice
savedFundSchema.index({ userId: 1, fundId: 1 }, { unique: true })

module.exports = mongoose.model("SavedFund", savedFundSchema)
