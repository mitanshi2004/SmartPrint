const PrintRequest = require("../models/print-request");

// Submit new print request
const submitPrintRequest = async (req, res) => {
  try {
    const { totalCopies, printType, pageRange, specialInstruction } = req.body;
    const lastRequest = await PrintRequest.findOne().sort({ createdAt: -1 });
    const nextToken = (lastRequest?.tokenNumber || 0) + 1;

    const printRequest = new PrintRequest({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      totalCopies,
      printType,
      pageRange,
      specialInstruction,
      tokenNumber: nextToken,
    });

    await printRequest.save();

    res.status(201).json({
      message: "Print request submitted successfully!",
      tokenNumber: printRequest.tokenNumber,
    });
  } catch (error) {
    console.error("Print Request Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all print requests — priority first, then time
const getAllPrintRequests = async (req, res) => {
  try {
    const requests = await PrintRequest.find().sort({
      priority: -1,
      createdAt: 1
    });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to load queue" });
  }
};

const jumpQueue = async (req, res) => {
  try {
    const id = req.params.id;
    const token = await PrintRequest.findById(id);
    if (!token) return res.status(404).json({ message: "Token not found" });

    token.priority = 1;
    token.paidAt = new Date(); // Optional: helps with sorting order
    await token.save();

    res.status(200).json({ message: "Token marked as paid!" });
  } catch (err) {
    console.error("Jump error:", err);
    res.status(500).json({ message: "Failed to jump queue" });
  }
};


module.exports = {
  submitPrintRequest,
  getAllPrintRequests,
  jumpQueue
};
