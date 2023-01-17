var express = require("express");
var router = express.Router();

var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// register
router.post("/register", async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// login

router.post("/login", async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "email/password required" });
  }
  try {
    let user = await User.findOne({ email });
    // no user
    if (!user) {
      return res.status(400).json({ error: " email not register" });
    }
    // password compare
    let result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    // generate token
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
    return token;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
