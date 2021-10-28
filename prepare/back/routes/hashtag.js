const express = require("express");
const { User, Post, Hashtag, Image, Comment } = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
router.get("/:hashtag", async (req, res, next) => {
  // GET  /posts
  try {
    const where = { UserId: parseInt(req.params.userId, 10) };
    if (parseInt(req.query.lastId, 10)) {
      //req.query.lastId가 있을 때 (초기로딩이 아닐 때)
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt"],
      ],
      include: [
        {
          model: Hashtag,
          where: { name: req.params.hashtag },
        },
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
    const postsJSON = posts.map((v) => {
      return PostAddCommentsCountAndSlice10Comments(v.toJSON());
    });
    // postsJSON.forEach();
    // res.status(201).json(posts);
    res.status(201).json(postsJSON);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
