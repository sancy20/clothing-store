const sequelize = require("../config/database");
const { Op } = require("sequelize");
const { Order, OrderItem, Product, User, ProductImage } = require("../models");
const abaApiService = require("../services/abaApiService");

const initiateKhqrPayment = async (req, res) => {
  const { cartItems, shippingAddress } = req.body;
  const userId = req.user.id;
  const t = await sequelize.transaction();

  try {
    let totalPrice = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.id);
      if (!product) throw new Error(`Product with ID ${item.id} not found.`);
      totalPrice += parseFloat(product.price) * item.quantity;
    }

    const order = await Order.create(
      {
        userId,
        total_price: totalPrice,
        shipping_address: JSON.stringify(shippingAddress),
        status: "pending",
        payment_method: "khqr",
      },
      { transaction: t }
    );

    for (const item of cartItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price,
          color_at_purchase: item.color,
          size_at_purchase: item.size,
        },
        { transaction: t }
      );
    }

    const qrCodeData = await abaApiService.generateQrCode({
      orderId: order.id,
      amount: order.total_price,
    });

    await t.commit();

    res.status(200).json({
      orderId: order.id,
      qrCode: qrCodeData.qrCode,
    });
  } catch (error) {
    await t.rollback();
    console.error("KHQR Initiation Error:", error);
    res.status(500).json({ message: "Failed to initiate KHQR payment." });
  }
};

const createCodOrder = async (req, res) => {
  const { cartItems, shippingAddress } = req.body;
  const userId = req.user.id;
  const t = await sequelize.transaction();

  try {
    let totalPrice = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.id);
      totalPrice += parseFloat(product.price) * item.quantity;
    }

    const order = await Order.create(
      {
        userId,
        total_price: totalPrice,
        shipping_address: JSON.stringify(shippingAddress),
        status: "pending",
        payment_method: "cod",
      },
      { transaction: t }
    );

    for (const item of cartItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price,
          color_at_purchase: item.color,
          size_at_purchase: item.size,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res
      .status(201)
      .json({ message: "Order placed successfully.", orderId: order.id });
  } catch (error) {
    await t.rollback();
    console.error("COD Order Creation Error:", error);
    res.status(500).json({ message: "Failed to create order." });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.orderId, userId: req.user.id },
    });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.status(200).json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const handlePaymentWebhook = async (req, res) => {
  const webhookPayload = req.body;
  const signature = req.headers["x-aba-signature"];

  try {
    const isVerified = abaApiService.verifyWebhook(webhookPayload, signature);
    if (!isVerified) return res.status(400).send("Invalid signature.");

    const { orderId, status } = webhookPayload;
    if (status === "success") {
      const order = await Order.findByPk(orderId);
      if (order && order.status === "pending") {
        order.status = "paid";
        await order.save();
      }
    }
    res.status(200).send("Webhook received.");
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Error processing webhook.");
  }
};

// --- ADMIN & USER-FACING CONTROLLERS ---

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: { model: User, attributes: ["name", "email"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (order) {
      order.status = req.body.status;
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status." });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const ordersData = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              include: { model: ProductImage, as: "images" },
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const orders = JSON.parse(JSON.stringify(ordersData));

    // --- DEBUGGING LOGIC STARTS HERE ---
    console.log("--- Debugging getMyOrders ---");
    for (const order of orders) {
      for (const item of order.orderItems) {
        if (item.product && item.product.images) {
          console.log(
            `Checking Order #${order.id}, Item: ${item.product.name}`
          );
          console.log(`- Purchased Color: ${item.color_at_purchase}`);
          // This next log is the most important one. It shows what images are available.
          console.log(`- Available Images in DB:`, item.product.images);

          const variantImage = item.product.images.find(
            (img) => img.color_hint === item.color_at_purchase
          );

          console.log(`- Found Matching Image:`, variantImage); // Will be undefined if no match is found

          if (variantImage) {
            item.product.image_url = variantImage.image_url;
          }
        }
      }
    }
    console.log("--- End Debugging ---");
    // --- DEBUGGING LOGIC ENDS HERE ---

    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    res.status(500).json({ message: "Failed to fetch your orders." });
  }
};

const getIncomeReport = async (req, res) => {
  try {
    const report = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("SUM", sequelize.col("total_price")), "totalSales"],
      ],
      where: {
        status: {
          [Op.in]: ["paid", "delivered"],
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
    });
    res.json(report);
  } catch (error) {
    console.error("Error generating income report:", error);
    res.status(500).json({ message: "Failed to generate income report." });
  }
};

module.exports = {
  initiateKhqrPayment,
  createCodOrder,
  getOrderStatus,
  handlePaymentWebhook,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
  getIncomeReport,
};
