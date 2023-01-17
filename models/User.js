let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let Schema = mongoose.Schema;

let userschema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// hash pasword
userschema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// password compare
userschema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

// genrate token
userschema.methods.signToken = async function () {
  let paylod = { userId: this.id, email: this.email };
  try {
    let token = await jwt.sign(paylod, "process.env.SECRET");
    return token;
  } catch (error) {
    next(error);
  }
};

// send require information method

userschema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};

module.exports = mongoose.model("User", userschema);
