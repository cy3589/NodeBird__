const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { User, Post, Comment, Image } = require("../models");
// const db = require("../models");
// const { isLoggedIn } = require("./middlewares");
const PostAddCommentsCountAndSlice10Comments = (fullPostJSON) => {
  fullPostJSON.commentsCount = fullPostJSON.Comments.length;
  fullPostJSON.Comments.splice(
    0,
    !(fullPostJSON.Comments.length - 10 < 0) &&
      fullPostJSON.Comments.length - 10
  );
  return fullPostJSON; // 객체배열의 map을 위해 추가
};

router.get("/", async (req, res, next) => {
  // GET  /posts
  try {
    const where = {};
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
        },
      ],
    });
    const postsJSON = posts.map((v) => {
      return PostAddCommentsCountAndSlice10Comments(v.toJSON());
    });
    res.status(201).json(postsJSON);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
