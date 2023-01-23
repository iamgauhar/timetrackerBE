const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UserModel } = require("../models/User.model");
const { userrValidation } = require("../middlewares/userValidation");

require("dotenv").config();

const UserRouter = express.Router();
UserRouter.use(cookieParser());
//  authorValidation,
// -----------------------------{ Signup route  }---------------------------->

UserRouter.post("/signup", userrValidation, async (req, res) => {
  const { name, username, email, password } = req.body;
  const newUser = await UserModel.findOne({
    $or: [{ email: email }, { username: username }],
  });
  // console.log(newAuthor);
  if (newUser) {
    return res.status(400).send({ result: false, msg: "User already exist" });
  }
  try {
    bcrypt.hash(password, 7, async (err, hashed) => {
      if (err) {
        return res.status(400).send({ result: false, msg: "Try again later" });
      }
      const userInfo = new UserModel({
        name: name,
        email: email,
        username: username,
        password: hashed,
      });
      await userInfo.save();
      res
        .status(201)
        .send({ result: true, msg: "Signup successful. Please Login" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ result: false, msg: "Try after some time" });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({
    $or: [{ email: email }, { username: email }],
  });

  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          { email, username: user.username },
          process.env.JWT_KEY,
          { expiresIn: "30 days" }
        );

        const refreshedToken = jwt.sign({ email }, process.env.JWT_KEY_2, {
          expiresIn: "40 days",
        });

        res.cookie("timeToken", token, { httpOnly: true });
        res.cookie("refreshToken", refreshedToken, { httpOnly: true });
        res.send({
          result: true,
          token: token,
          reftoken: refreshedToken,
          name: user.name,
          msg: "Login Successful",
        });
        // redis.set("token", token);
        // redis.set("refToken", refreshedToken);

        // redis.mget("token", "refToken", (err, result) => {
        //   if (err) {
        //     res.status(400).send({ result: false, msg: "Invalid Credential" });
        //   } else {
        //     console.log(result);
        //     res.status(200).send({
        //       result: true,
        //       msg: " Login Successfull",
        //       token: result[0],
        //       refToken: result[1],
        //     });
        //   }
        // });
      } else {
        res.status(401).send({ result: false, msg: "Invalid Credential" });
      }
    });
  } else {
    res.status(401).send({ result: false, msg: "Invalid Credential" });
  }
});

module.exports = { UserRouter };
