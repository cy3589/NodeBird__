const express = require("express");
const router = express.Router();
const { User, Post, Comment, Image } = require("../models");
const db = require("../models");
const { isLoggedIn } = require("./middlewares");

router.get("/", async (req, res, next) => {
  // GET  /posts
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        { model: User, as: "Likers", attributes: [`id`] }, //좋아요 누른사람
      ],
    });
    res.status(201).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
