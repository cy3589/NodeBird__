const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { User, Post, Comment, Image } = require("../models");
const db = require("../models");
const { isLoggedIn } = require("./middlewares");

router.get("/", async (req, res, next) => {
  // GET  /posts
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
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
        { model: User, as: "Likers", attributes: [`id`] },
        {
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
        }, //좋아요 누른사람
      ],
    });
    res.status(201).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
