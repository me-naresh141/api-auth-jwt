var jwt = require("jsonwebtoken");
module.exports = {
  verifyToken: async (req, res, next) => {
    var token = req.headers.authrization;
    try {
      if (token) {
        var paylod = await jwt.verify(token, "process.env.SECRET");
        req.user = paylod;
        return next();
      } else {
        res.status(400).json({ error: "Token required" });
      }
    } catch (error) {
      next(error);
    }
  },
};
