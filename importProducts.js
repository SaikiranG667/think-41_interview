require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/think41", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  id: String,
  cost: Number,
  category: String,
  name: String,
  brand: String,
  retail_price: Number,
  department: String,
  sku: String,
  distribution_center_id: String,
});

const Product = mongoose.model("Product", productSchema);

// Load CSV and insert into MongoDB
const results = [];

fs.createReadStream("archive/products.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push({
      id: data.id,
      cost: parseFloat(data.cost),
      category: data.category,
      name: data.name,
      brand: data.brand,
      retail_price: parseFloat(data.retail_price),
      department: data.department,
      sku: data.sku,
      distribution_center_id: data.distribution_center_id,
    });
  })
  .on("end", async () => {
    try {
      await Product.insertMany(results);
      console.log("Data imported successfully!");
    } catch (err) {
      console.error("Error inserting data:", err);
    } finally {
      mongoose.connection.close();
    }
  });
