const mongoose = require("mongoose");

const PrintRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Assuming you already have a User model
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  totalCopies: {
    type: Number,
    required: true
  },
  printType: {
  type: String,
  enum: [
    "B/W Print",
    "Color Print",
    "Hard Binding",
    "Spiral Binding",
    "Passport Photo Print",
    "Glossy Print",
    "Lamination",
    "Resume/CV",
    "Aadhar/PAN Card"
  ],
    required: true
  },
  pageRange: {
    type: String
  },
  specialInstruction: {
    type: String
  },
  tokenNumber: {
    type: Number,
    required: true,
    unique: true
  },
  priority: {
    type: Boolean,
    default: false
  },
  queueIndex: {
  type: Number,
  default: 0
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("print-request", PrintRequestSchema);
