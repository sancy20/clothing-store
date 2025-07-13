"use strict";

const { Product, ProductVariant, ProductImage } = require("../models");

const productsData = [
  // --- BAPE ---
  {
    product: {
      name: "ABC Camo Shark Full Zip Hoodie",
      description:
        "A signature BAPE item. Features the iconic full-zip shark face on the hood and split ABC camo design.",
      price: 439.0,
      gender: "Unisex",
      main_category: "Clothing",
      category: "Hoodies",
      brand: "BAPE",
    },
    images: [
      { imageUrl: "https://i.ibb.co/LQr1f8M/bape-blue.png", colorHint: "Blue" },
      {
        imageUrl: "https://i.ibb.co/3Wb0mXJ/bape-green.png",
        colorHint: "Green",
      },
    ],
    variants: [
      { color: "Blue", size: "S", stock_quantity: 5 },
      { color: "Blue", size: "M", stock_quantity: 8 },
      { color: "Blue", size: "L", stock_quantity: 4 },
      { color: "Green", size: "S", stock_quantity: 6 },
      { color: "Green", size: "M", stock_quantity: 7 },
      { color: "Green", size: "L", stock_quantity: 3 },
    ],
  },
  {
    product: {
      name: "BAPE STA #7 Trainers",
      description:
        "The iconic BAPE STA sneaker in a classic colorway. Features premium leather upper with the signature STA star logo.",
      price: 329.0,
      gender: "Unisex",
      main_category: "Shoes",
      category: "Sneakers",
      brand: "BAPE",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/2vB7x6P/bapesta-white.png",
        colorHint: "White",
      },
      {
        imageUrl: "https://i.ibb.co/j3Rz12M/bapesta-black.png",
        colorHint: "Black",
      },
    ],
    variants: [
      { color: "White", size: "8", stock_quantity: 10 },
      { color: "White", size: "9", stock_quantity: 12 },
      { color: "White", size: "10", stock_quantity: 8 },
      { color: "Black", size: "8", stock_quantity: 7 },
      { color: "Black", size: "9", stock_quantity: 11 },
      { color: "Black", size: "10", stock_quantity: 9 },
    ],
  },
  {
    product: {
      name: "BAPE College Tee",
      description:
        "Classic BAPE College logo tee. A staple for any streetwear enthusiast, made from high-quality cotton.",
      price: 115.0,
      gender: "Unisex",
      main_category: "Clothing",
      category: "T-Shirts",
      brand: "BAPE",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/kM1jWc9/bape-college-white.png",
        colorHint: "White",
      },
      {
        imageUrl: "https://i.ibb.co/h7Wf5jw/bape-college-black.png",
        colorHint: "Black",
      },
    ],
    variants: [
      { color: "White", size: "S", stock_quantity: 20 },
      { color: "White", size: "M", stock_quantity: 25 },
      { color: "White", size: "L", stock_quantity: 15 },
      { color: "Black", size: "S", stock_quantity: 18 },
      { color: "Black", size: "M", stock_quantity: 22 },
      { color: "Black", size: "L", stock_quantity: 14 },
    ],
  },
  // --- Supreme ---
  {
    product: {
      name: "Supreme Box Logo Hooded Sweatshirt",
      description:
        "The quintessential Supreme piece. Heavyweight crossgrain fleece with the iconic box logo embroidery on the chest.",
      price: 168.0,
      gender: "Unisex",
      main_category: "Clothing",
      category: "Hoodies",
      brand: "Supreme",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/C0sD3g2/supreme-black.png",
        colorHint: "Black",
      },
      {
        imageUrl: "https://i.ibb.co/2tW2Y4c/supreme-grey.png",
        colorHint: "Heather Grey",
      },
    ],
    variants: [
      { color: "Black", size: "M", stock_quantity: 10 },
      { color: "Black", size: "L", stock_quantity: 7 },
      { color: "Black", size: "XL", stock_quantity: 4 },
      { color: "Heather Grey", size: "M", stock_quantity: 12 },
      { color: "Heather Grey", size: "L", stock_quantity: 9 },
    ],
  },
  {
    product: {
      name: "Supreme Hanes Tagless Tees (3 Pack)",
      description:
        "A 3-pack of classic cotton crewneck t-shirts made by Hanes, featuring a small Supreme box logo printed on the lower left front.",
      price: 40.0,
      gender: "Unisex",
      main_category: "Clothing",
      category: "T-Shirts",
      brand: "Supreme",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/XzS1wBF/supreme-tee-white.png",
        colorHint: "White",
      },
      {
        imageUrl: "https://i.ibb.co/yQj9sQk/supreme-tee-black.png",
        colorHint: "Black",
      },
    ],
    variants: [
      { color: "White", size: "M", stock_quantity: 50 },
      { color: "White", size: "L", stock_quantity: 45 },
      { color: "Black", size: "M", stock_quantity: 48 },
      { color: "Black", size: "L", stock_quantity: 40 },
    ],
  },
  {
    product: {
      name: "Supreme S Logo Beanie",
      description:
        "Classic cuff beanie in acrylic with an embroidered S logo on the cuff. A winter essential for any collection.",
      price: 40.0,
      gender: "Unisex",
      main_category: "Accessories",
      category: "Hats",
      brand: "Supreme",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/k2H1CgJ/supreme-s-logo-black.png",
        colorHint: "Black",
      },
      {
        imageUrl: "https://i.ibb.co/2W7pXgX/supreme-s-logo-red.png",
        colorHint: "Red",
      },
    ],
    variants: [
      { color: "Black", size: "One Size", stock_quantity: 30 },
      { color: "Red", size: "One Size", stock_quantity: 25 },
    ],
  },
  // --- Off-White ---
  {
    product: {
      name: "Off-White Caravaggio Painting T-Shirt",
      description:
        "Signature Off-White style. Cotton t-shirt featuring a Caravaggio graphic print on the front and the iconic arrows graphic on the back.",
      price: 385.0,
      gender: "Men",
      main_category: "Clothing",
      category: "T-Shirts",
      brand: "Off-White",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/d7z7VfV/offwhite-tee-black.png",
        colorHint: "Black",
      },
      {
        imageUrl: "https://i.ibb.co/9h7Kk5F/offwhite-tee-white.png",
        colorHint: "White",
      },
    ],
    variants: [
      { color: "Black", size: "S", stock_quantity: 11 },
      { color: "Black", size: "M", stock_quantity: 14 },
      { color: "Black", size: "L", stock_quantity: 9 },
      { color: "White", size: "S", stock_quantity: 10 },
      { color: "White", size: "M", stock_quantity: 15 },
    ],
  },
  {
    product: {
      name: "Off-White Out Of Office 'OOO' Sneakers",
      description:
        "A late 80s and early 90s inspired sneaker with a low-top silhouette, featuring the signature Off-White zip tie tag and arrows motif.",
      price: 650.0,
      gender: "Unisex",
      main_category: "Shoes",
      category: "Sneakers",
      brand: "Off-White",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/Q8WzQzT/offwhite-ooo-white.png",
        colorHint: "White/Blue",
      },
      {
        imageUrl: "https://i.ibb.co/sK6f47M/offwhite-ooo-black.png",
        colorHint: "Black/White",
      },
    ],
    variants: [
      { color: "White/Blue", size: "41", stock_quantity: 8 },
      { color: "White/Blue", size: "42", stock_quantity: 10 },
      { color: "White/Blue", size: "43", stock_quantity: 7 },
      { color: "Black/White", size: "41", stock_quantity: 6 },
      { color: "Black/White", size: "42", stock_quantity: 9 },
    ],
  },
  {
    product: {
      name: "Off-White Industrial Belt",
      description:
        "The iconic Off-White industrial belt, featuring bold logo branding and a heavy-duty buckle.",
      price: 255.0,
      gender: "Unisex",
      main_category: "Accessories",
      category: "Belts",
      brand: "Off-White",
    },
    images: [
      {
        imageUrl: "https://i.ibb.co/gZvyhgy/offwhite-belt-yellow.png",
        colorHint: "Yellow",
      },
      {
        imageUrl: "https://i.ibb.co/QcgTzD5/offwhite-belt-black.png",
        colorHint: "Black",
      },
    ],
    variants: [
      { color: "Yellow", size: "One Size", stock_quantity: 35 },
      { color: "Black", size: "One Size", stock_quantity: 30 },
    ],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const item of productsData) {
      const product = await Product.create(item.product);

      for (const image of item.images) {
        await ProductImage.create({
          product_id: product.id,
          image_url: image.imageUrl,
          color_hint: image.colorHint,
        });
      }

      for (const variant of item.variants) {
        await ProductVariant.create({
          product_id: product.id,
          color: variant.color,
          size: variant.size,
          stock_quantity: variant.stock_quantity,
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("product_variants", null, {});
    await queryInterface.bulkDelete("products", null, {});
  },
};
