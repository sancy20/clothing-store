const express = require("express");
const router = express.Router();
const {
  initiateKhqrPayment,
  createCodOrder,
  getOrderStatus,
  handlePaymentWebhook,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
  getIncomeReport,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");
router.post("/initiate-khqr", protect, initiateKhqrPayment);
router.post("/cod", protect, createCodOrder);
router.get("/status/:orderId", protect, getOrderStatus);

// === WEBHOOK ROUTE (NO AUTH) ===
router.post("/webhook/payment-complete", handlePaymentWebhook);

// === USER-FACING ROUTES ===
router.get("/my-orders", protect, getMyOrders);

// === ADMIN ROUTES ===
router.get("/", protect, admin, getAllOrders);
router.get("/reports/income", protect, admin, getIncomeReport);
router.put("/:orderId/status", protect, admin, updateOrderStatus);

module.exports = router;
