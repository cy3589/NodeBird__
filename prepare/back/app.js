const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const morgan = require("morgan");

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
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

app.get("/", (req, res) => {
  res.send("Hello Express");
});

// app.use((err, req, res, next) => {});  //에러처리 미들웨어는 기본적으로 포함되나 에러에 대해
// 특별한 동작을 하게 하고싶을 때 작성한다.

app.listen(3065, () => {
  console.log("서버 실행 중");
});
