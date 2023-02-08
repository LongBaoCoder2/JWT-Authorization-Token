const express = require("express");
const app = express();
const verifyToken = require("./middleware/verifyToken");
let { userPost } = require("./DataBase/userPost");
app.use(express.json());

// Route posts
app.get("/posts", verifyToken, (req, res) => {
  const listPost = userPost.filter((post) => post.userId === req.userId);

  res.json(listPost);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
