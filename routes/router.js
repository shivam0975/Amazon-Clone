const express = require('express');
const router = express.Router();
const products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

router.get("/getproducts", async (req, res) => {
  try {
    const producstdata = await products.find();
    return res.status(200).json(producstdata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
      return res.status(422).json({ error: "Please fill all fields" });
    }

    const preuser = await User.findOne({ email });
    if (preuser) {
      return res.status(422).json({ error: "Email already exists" });
    }
    if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const finaluser = new User({ fname, email, mobile, password, cpassword });
    const storedata = await finaluser.save();
    return res.status(201).json(storedata);
  } catch (error) {
    console.error("register error", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const userlogin = await User.findOne({ email });
    if (!userlogin) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, userlogin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await userlogin.generateAuthToken();

    res.cookie("eccomerce", token, {
      expires: new Date(Date.now() + 258900000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    return res.status(200).json(userlogin);
  } catch (error) {
    console.error("login error", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const individual = await products.findOne({ id });
    if (!individual) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json(individual);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await products.findOne({ id });
    if (!cartItem) return res.status(404).json({ error: "Product not found" });

    const user = await User.findOne({ _id: req.userID });
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.addcartdata(cartItem);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/cartdetails", authenticate, async (req, res) => {
  try {
    const buyuser = await User.findOne({ _id: req.userID });
    return res.status(200).json(buyuser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/validuser", authenticate, async (req, res) => {
  try {
    const validuserone = await User.findOne({ _id: req.userID });
    return res.status(200).json(validuserone);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter(curelem => curelem.token !== req.token);
    await req.rootUser.save();
    res.clearCookie('eccomerce', { path: '/' });
    return res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter(curel => curel.id !== id);
    await req.rootUser.save();
    return res.status(200).json(req.rootUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
