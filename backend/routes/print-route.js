const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

const {
  submitPrintRequest,
  getAllPrintRequests,
  jumpQueue,
} = require("../controllers/printController");

// Submit print request
router.post("/", auth, upload.single("file"), submitPrintRequest);

// Get all active print requests (for Queue page)
router.get("/queue", auth, getAllPrintRequests);

// Jump queue (paid ₹20)
router.put("/jump/:id", auth, jumpQueue); // ✅

module.exports = router;
