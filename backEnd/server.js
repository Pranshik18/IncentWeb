const express = require("express");
const mongoose = require("mongoose");
const Product = require("./model/productModel");
const app = express();
console.log(Product);
//JSON middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT , DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})
//routes
app.get("/", (req, res) => {
  res.send("Hello Welcome to database!");
});

//Get All Products
app.get("/employee", async (req, res) => {
  try {
    const _id = req.query._id
    const emp_name = req.query.emp_name
    const emp_email = req.query.emp_email
    const emp_pass = req.query.emp_pass
    const emp_role = req.query.emp_role

    const query = {}
    if (_id) {
      query._id = _id
    }
    if (emp_name) {
      query.emp_name = emp_name
    }
    if (emp_email) {
      query.emp_email = emp_email
    }
    if (emp_pass) {
      query.emp_pass = emp_pass
    }
    if (emp_role) {
      query.emp_role = emp_role
    }
    const employees = await Product.find(query);
    res.send(employees)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GEt product with id
app.get("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create a new Product
app.post("/employee", async (req, res) => {
  // res.send(req.body)
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//Edit the Product
app.put("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Can't find any product with id ${id}` });
    }
    const updatedProduct = await Product.findById(id)
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete Product
app.delete("/employee/:id",async(req,res)=>{
  try{
    const {id}=req.params;
    const product = await Product.findByIdAndDelete(id);
    if(!product){
      return res.status(404).json({message:`Can't find with ID ${id}`})
    }res.status(200).json(product);
  }catch(error){
    res.status().json({message:error.message})
  }
})



//Connecting with the server
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/employee")
  .then(() => {
    app.listen(3012, () => {
      console.log("Running on 3012!");
    });
    console.log("Connected to mongo db");
  })
  .catch((error) => {
    console.log(error);
  });