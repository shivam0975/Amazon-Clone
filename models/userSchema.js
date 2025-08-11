const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  cpassword: { type: String },
  tokens: [{ token: { type: String, required: true } }],
  carts: { type: Array, default: [] }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = this.password;
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (err) {
    console.error('generateAuthToken error', err);
  }
};

userSchema.methods.addcartdata = async function (cartItem) {
  this.carts = this.carts.concat(cartItem);
  await this.save();
  return this.carts;
};

module.exports = mongoose.model('User', userSchema);
