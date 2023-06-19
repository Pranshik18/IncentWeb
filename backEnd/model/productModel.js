const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    emp_id: String,
    emp_name: String,
    emp_email: String,
    emp_pass : String,
    emp_Stats: Object,
    emp_role : String,
    permissions: Object,
    card_permissions: Object,
    createdBy: String,
    modifiedBy : String,
  }, {
    versionKey : false
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;