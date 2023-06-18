const router = require("express").Router();
const productController = require('../controllers/productController');

router.post("/");
router.get("/" , productController.allProducts);
router.put("/productId");
router.delete("/productId");
router.get("/productId");


module.exports = router;