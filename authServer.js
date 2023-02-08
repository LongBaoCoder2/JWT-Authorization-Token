require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
let { userDB } = require("./DataBase/userDB");
const verifyToken = require("./middleware/verifyToken");

// Configure express
app.use(express.json());

// Handle login
// Generate token
const generateToken = (payload) => {
  const { id, username } = payload;

  const accessToken = jwt.sign(
    { id, username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    { id, username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  return { accessToken, refreshToken };
};

// Update refresh token to DB
const updateRefreshToken = (userId, refreshToken) => {
  userDB = userDB.map((user) => {
    if (user.id === userId) return { ...user, refreshToken };
    return user;
  });
};

// Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = userDB.find((user) => user.username === username);
  if (!user) res.sendStatus(401);

  const token = generateToken(user);
  updateRefreshToken(user.id, token.refreshToken);

  console.log(userDB);
  res.json({ token });
});

// Logout
app.delete("/logout", verifyToken, (req, res) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.sendStatus(401);

  updateRefreshToken(req.userId, null);
  console.log(userDB);
});

// Setup accessToken from refreshToken
app.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const user = userDB.find((user) => user.refreshToken === refreshToken);
  if (!user) res.sendStatus(401);

  const token = generateToken(user);
  updateRefreshToken(user.id, token.refreshToken);
  res.json({ token });
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
