const express = require("express");
const { User, Post } = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
router.get("/", async (req, res, next) => {
  try {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(Post);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: "password" },
        include: [
          { model: Post, attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
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

module.exports = router;
