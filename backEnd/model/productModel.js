const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    emp_id: String,
    emp_name: String,
    emp_email: String,
    emp_pass : String,
    emp_Stats: Object,
    emp_role : String,
    permissions : Array
  }, {
    versionKey : false
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;