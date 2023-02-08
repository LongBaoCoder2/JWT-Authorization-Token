const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) res.sendStatus(401);

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = payload.id;

    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

module.exports = verifyToken;
