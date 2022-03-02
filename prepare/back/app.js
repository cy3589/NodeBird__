const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const hpp = require("hpp");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");
const passportConfig = require("./passport");
const app = express();
dotenv.config();
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
const cookieOption = {};
if (process.env.NODE_ENV === "production") {
  cookieOption["httpOnly"] = true;
  cookieOption["secure"] = true;
}
// domain: process.env.NODE_ENV === "production" && ".mynodesns.shop", //도메인 연결 후 작성 .xxx.xx 형식으로 작성
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: cookieOption,
    // cookie: {
    //   httpOnly: true,
    //   secure: true,
    //   // domain: process.env.NODE_ENV === "production" && ".mynodesns.shop", //도메인 연결 후 작성 .xxx.xx 형식으로 작성
    // },
  })
);

app.use(passport.initialize());
app.use(passport.session());

db.sequelize
  .sync()
  .then(() => {
    console.log("db연결성공");
  })
  .catch((error) => {
    console.log(error);
  });
passportConfig();

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

// app.use((err, req, res, next) => {});  //에러처리 미들웨어는 기본적으로 포함되나 에러에 대해
// 특별한 동작을 하게 하고싶을 때 작성한다.

app.listen(process.env.NODE_ENV === "production" ? 80 : 3065, () => {
  // dev: localhost:3065 , prod:80
  console.log("서버 실행 중");
});
