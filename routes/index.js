const express = require('express');
const router = express.Router();

const { userLogin, userRegister, userLogout } = require('../function/user.js');
const { userCart, deleteCartItem } = require('../function/cart.js');
const { dataAdmin } = require('../function/admin.js');
const { home } = require('../function/buyer.js')

router.get("/login", userLogin);
router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/logout", userLogout);

router.get("/home", home);

router.get("/cart", userCart);
router.post("/addCart", userCart);
router.post("/deleteCart", deleteCartItem);

router.get("/admin", dataAdmin);
router.post("/admin", dataAdmin);

module.exports = router;