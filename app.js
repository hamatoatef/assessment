const express = require("express");
const cookieSession = require("cookie-session");
const userRouter = require("./routes/userRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use("/api/v1/users", userRouter);

module.exports = app;
