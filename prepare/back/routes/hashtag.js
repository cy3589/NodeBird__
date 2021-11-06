const express = require("express");
const { User, Post, Hashtag, Image, Comment } = require("../models");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Op } = require("sequelize");
const PostAddCommentsCountAndSlice10Comments = (fullPostJSON) => {
  fullPostJSON.commentsCount = fullPostJSON.Comments.length;
  fullPostJSON.Comments.splice(10);
  return fullPostJSON; //객체배열의 map을 위해 추가
};
router.get("/:hashtag", async (req, res, next) => {
  // GET  /posts
  try {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(decodeURIComponent(req.params.hashtag));
    console.log(req.query);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
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
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
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
    res.status(201).json(postsJSON);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
