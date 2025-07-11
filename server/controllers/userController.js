const User = require("../models/User");
const Address = require("../models/Address");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");

require("dotenv").config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password_hash: password,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.isValidPassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.currentPassword && req.body.newPassword) {
      if (await user.isValidPassword(req.body.currentPassword)) {
        user.password_hash = req.body.newPassword;
        await user.save();
      } else {
        res.status(401).json({ message: "Invalid current password" });
        return;
      }
    } else {
      await user.save();
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

const getMyAddresses = async (req, res) => {
  const addresses = await Address.findAll({
    where: { userId: req.user.id },
    order: [
      ["isDefault", "DESC"],
      ["createdAt", "DESC"],
    ],
  });
  res.json(addresses);
};

const addMyAddress = async (req, res) => {
  const {
    fullName,
    addressLine1,
    city,
    state,
    postalCode,
    country,
    phoneNumber,
    isDefault,
  } = req.body;

  const transaction = await sequelize.transaction();
  try {
    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id }, transaction }
      );
    }
    const address = await Address.create(
      { userId: req.user.id, ...req.body },
      { transaction }
    );
    await transaction.commit();
    res.status(201).json(address);
  } catch (error) {
    await transaction.rollback();
    res
      .status(400)
      .json({ message: "Failed to add address", error: error.message });
  }
};

const updateMyAddress = async (req, res) => {
  const address = await Address.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  const transaction = await sequelize.transaction();
  try {
    if (req.body.isDefault && req.body.isDefault !== address.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id }, transaction }
      );
    }
    await address.update(req.body, { transaction });
    await transaction.commit();
    res.json(address);
  } catch (error) {
    await transaction.rollback();
    res
      .status(400)
      .json({ message: "Failed to update address", error: error.message });
  }
};

const deleteMyAddress = async (req, res) => {
  const address = await Address.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }
  await address.destroy();
  res.json({ message: "Address removed" });
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
};
