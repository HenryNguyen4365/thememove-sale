const mongoose = require("mongoose");
const CustomersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    themeId: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    created_at: {
      type: String,
    },
    url: {
      type: String,
    },
    review: {
      type: Number,
    },
    sales: {
      type: Number,
    },
    updatedAt3: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Customers || mongoose.model("Customers", CustomersSchema);
