const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { User, Post, Comment, Image, Hashtag, sequelize } = require("../models");
const { isLoggedIn } = require("./middlewares");
const PostAddCommentsCountAndSlice10Comments = (fullPostJSON) => {
  fullPostJSON.commentsCount = fullPostJSON.Comments.length;
  fullPostJSON.Comments.splice(10);
};
try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads폴더가 없으므로 생성합니다");
  fs.mkdirSync("uploads");
}

// `/post/${data.postId}/comments?lastCommentId=${data.lastCommentId || 0}`;
router.get("/:PostId/comments", async (req, res, next) => {
  try {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(req.params.PostId, req.query.lastCommentId);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    const post = await Post.findOne({
      where: { id: parseInt(req.params.PostId) },
    });
    console.log(!post);
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const resComments = await Comment.fineAll({
      where: {},
    });
    // const fullPost = await Post.findOne({
    //   where: { id: post?.id },
    //   include: [
    //     {
    //       model: Post,
    //       as: "Retweet",
    //       include: [
    //         { model: User, attributes: ["id", "nickname"] },
    //         { model: Image },
    //       ],
    //     },
    //     { model: User, attributes: ["id", "nickname"] },
    //     { model: Image },
    //     {
    //       model: Comment,
    //       include: [
    //         {
    //           model: User,
    //           attributes: ["id", "nickname"],
    //         },
    //       ],
    //     },
    //     {
    //       model: User,
    //       as: "Likers",
    //       attributes: ["id", "nickname"],
    //     },
    //   ],
    // });

    res.status(200).json("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// const db = require("../models");
// const user = require("../models/user");

//라우터로 접근할 때 req.user로 사용자 정보를 복구해서 접근하도록 passport에서 코딩함.
//deserializeUser
//라우터에서 req.user로 현재 사용자에 대한 접근이 가능.

router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId) },
    });
    console.log(!post);
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const fullPost = await Post.findOne({
      where: { id: post?.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
        },
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    const fullPostJSON = fullPost.toJSON();

    PostAddCommentsCountAndSlice10Comments(fullPostJSON);
    console.log(fullPostJSON);
    console.log(fullPostJSON.Comments.length);
    // res.status(200).json(fullPost);
    res.status(200).json(fullPostJSON);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    res.send("Post");
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
router.patch("/edit/:PostId", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.PostId) },
      include: [{ model: User, attributes: ["id"] }],
    });
    if (post.UserId !== req.user.id) {
      res.statusCode(403).send("타인의 게시글은 수정할 수 없습니다.");
    }
    await Post.update(
      { content: req.body.content },
      { where: { id: parseInt(req.params.PostId) } }
    );
    const fullPost = await Post.findOne({
      where: { id: parseInt(req.params.PostId) },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
        },
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullPost);
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

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId) },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    if (post.Retweet && post.Retweet.UserId === req.user.id) {
      return res.status(403).send("자신의 글은 리트윗 할 수 없습니다.");
    }
    const retweetTargetId = post.RetweetId || post.id;
    //post가 Retweet한 게시글이면 Retweet한 게시글의ID를 갖고오고 Null이면 post.id를 갖고온다.
    const exPost = await Post.findOne({
      where: { UserId: req.user.id, RetweetId: retweetTargetId },
      //내가 쓴 게시글 내 Retweet게시글 중 retweetTargetId가 있는지 확인, 있다면 이미 리트윗 한 게시글이다.
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗 했습니다.");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
        },
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
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
      done(null, basename + "__" + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20메가바이트(20mb)
});
// router.post(
//   "/images",
//   upload.array("image"),
//   isLoggedIn,
//   async (req, res, next) => {
//     try {
//       res.json(req.files.map((v) => v.filename));
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

router.post("/", upload.array("image"), isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    const hashtags_ = req.body.content.match(/(#[^\s#]+)/g);
    console.log(hashtags_);
    const hashtags = [...new Set(hashtags_)];
    console.log(hashtags);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((v) =>
          Hashtag.findOrCreate({
            where: { name: v.slice(1).toLowerCase() },
          })
        )
      );
      // result.map((v) => {
      //   console.log(v[0].name);
      // });
      await post.addHashtags(result.map((v) => v[0]));
      // console.log(result);
    }

    const images = await Promise.all(
      req.files.map((image) =>
        Image.create({ src: `http://localhost:3065/${image.filename}` })
      )
    );
    await post.addImages(images);
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
module.exports = router;
