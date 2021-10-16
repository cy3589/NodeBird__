const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { User, Post, Comment, Image } = require("../models");
const { isLoggedIn } = require("./middlewares");

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads폴더가 없으므로 생성합니다");
  fs.mkdirSync("uploads");
}

// const db = require("../models");
// const user = require("../models/user");

//라우터로 접근할 때 req.user로 사용자 정보를 복구해서 접근하도록 passport에서 코딩함.
//deserializeUser
//라우터에서 req.user로 현재 사용자에 대한 접근이 가능.
router.get("/", async (req, res, next) => {
  try {
    res.send(Post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("로그인이 필요합니다.");
    }
    await post.addLikers(req.user.id); // DB조작할 때에는 await을 꼭 붙여야 한다.
    res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("로그인이 필요합니다.");
    }
    await post.removeLikers(req.user.id); // DB조작할 때에는 await을 꼭 붙여야 한다.
    res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  //delete  /postId
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(201).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isLoggedIn, async (req, res, next) => {
  //전달된 data는 req.body에 담겨있다
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }], //댓글의 작성자
        },
        { model: User, attributes: ["id", "nickname"] }, //게시글의 작성자
        { model: User, attributes: ["id"], as: "Likers" }, //좋아요 누른사람
      ],
    });
    //위 3개 다 User에서 갖고온다.
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId) },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); //파일확장자추출(ex: .png)
      const basename = path.basename(file.originalname, ext); //ext를 제외한 파일 이름만 추출
      done(null, basename + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20메가바이트(20mb)
});
router.post(
  "/images",
  upload.array("image"),
  isLoggedIn,
  async (req, res, next) => {
    try {
      res.json(req.files.map((v) => v.filename));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
