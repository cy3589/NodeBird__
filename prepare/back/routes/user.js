const express = require("express");
const { User, Post, Comment, Image, sequelize } = require("../models");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const PostAddCommentsCountAndSlice10Comments = (fullPostJSON) => {
  fullPostJSON.commentsCount = fullPostJSON.Comments.length;
  fullPostJSON.Comments.splice(10);
  return fullPostJSON; //객체배열의 map을 위해 추가
};

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: "password" },
        include: [
          { model: Post, attributes: ["id", "RetweetId"] },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      console.log(12345);
      res.status(404).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  req.session.destroy();
  res.send("Logged Out");
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  //미들웨어 확장기법
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: "password" },
        include: [
          { model: Post, attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });
      return res.status(201).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  const email = req.body.email;
  const nickname = req.body.nickname;
  try {
    const exUser = await User.findOne({
      where: { email },
    });
    if (exUser) {
      return res.status(403).send("이미 등록된 이메일 입니다."); //return으로 함수(라우터)를 종료
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.create({
      email: email,
      nickname: nickname,
      password: hashedPassword,
    });
    res.status(201).send("OK");
  } catch (error) {
    console.error(error);
    next(error); //status 500
  }
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      { where: { id: req.user.id } }
    );
    res.status(201).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 사용자입니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(201).json({
      UserId: parseInt(req.params.userId),
      Nickname: user.nickname,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 사용자입니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(201).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 사용자입니다.");
    }
    await user.removeFollowings(req.user.id);
    res.status(201).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 사용자입니다.");
    }

    const followers = await user.getFollowers({
      attributes: ["id", "nickname"],
    });
    res.status(201).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 사용자입니다.");
    }
    const followings = await user.getFollowings({
      attributes: ["id", "nickname"],
    });
    res.status(201).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
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

router.get("/info/:userId", async (req, res, next) => {
  // GET  /posts
  try {
    const UserInfo = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
      attributes: ["id", "nickname", "createdAt"],
      include: [
        { model: Post, attributes: ["id"] },
        { model: User, as: "Followings", attributes: ["id"] },
        { model: User, as: "Followers", attributes: ["id"] },
      ],
    });
    if (!UserInfo) {
      return res.status(404).send("존재하지 않는 사용자입니다");
    }
    const resUserInfo = {
      postsLength: UserInfo.Posts.length,
      id: UserInfo.id,
      nickname: UserInfo.nickname,
      followingsLength: UserInfo.Followings.length,
      followersLength: UserInfo.Followers.length,
      createdAt: UserInfo.createdAt,
    };
    console.log("게시물 수 : ", UserInfo.Posts.length);
    console.log("id: ", UserInfo.id);
    console.log("nickname: ", UserInfo.nickname);
    console.log("팔로잉 수 ", UserInfo.Followings.length);
    console.log("팔로워 수 ", UserInfo.Followers.length);
    console.log("계정생성일 ", UserInfo.createdAt);
    res.status(201).json(resUserInfo);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:UserId/:followWhat", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.UserId) },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 사용자입니다.");
    }
    const UserId = parseInt(req.params.UserId);
    const lastDate = new Date(parseInt(req.query.lastAt, 10)).toISOString();
    const lastFollowId = parseInt(req.query.lastFollowId, 10);
    console.log(UserId, lastDate, lastFollowId);
    if (req.params.followWhat === "followings") {
      const result = await user.getFollowings({
        attributes: ["id", "nickname", "createdAt"],
        limit: 10,
      });
      // const [result] = await sequelize.query(
      //   "SELECT * FROM (SELECT  `User`.`nickname`, `Follow`.`createdAt` AS `createdAt`, `Follow`.`FollowingId` AS `id`, `Follow`.`FollowerId` AS `myId` FROM `Users` AS `User` INNER JOIN `Follow` AS `Follow` ON `User`.`id` = `Follow`.`FollowingId` AND `Follow`.`FollowerId` = :UserId GROUP BY createdAt) AS TB WHERE createdAt>:lastDate AND id!=:lastFollowId LIMIT 10",
      //   { replacements: { UserId, lastDate, lastFollowId } }
      // );
      // const result = [{ email: "email", id: 23, nickname: "nickname" }];
      console.log(result);
      res.status(200).json(result);
    } else if (req.params.followWhat === "followers") {
      // const [result] = await sequelize.query(
      //   "SELECT * FROM ( SELECT  `User`.`nickname`, `Follow`.`createdAt` AS `createdAt`, `Follow`.`FollowingId` AS `myId`, `Follow`.`FollowerId` AS `id` FROM `Users` AS `User` INNER JOIN `Follow` AS `Follow` ON `User`.`id` = `Follow`.`FollowerId` AND `Follow`.`FollowingId` = :UserId  GROUP BY createdAt) AS TB WHERE createdAt>:lastDate AND id!=:lastFollowId LIMIT 10",
      //   { replacements: { UserId, lastDate, lastFollowId } }
      // );
      // console.log(result);
      const result = await user.getFollowers({
        attributes: ["id", "nickname", "createdAt"],
        limit: 10,
      });

      res.status(200).json(result);
    }
    // console.log();
    // console.log("lastFollowId : ", lastFollowId);
    // console.log("lastDate : ", lastDate);
    // console.log(req.params.UserId);
    // console.log(req.params.followWhat);
    // res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
