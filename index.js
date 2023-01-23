const express = require("express");
const cors = require("cors");

const { connection } = require("./configs/db");
const { UserRouter } = require("./routes/User.route");
const cookieParser = require("cookie-parser");
// const { authorAuth } = require("./controllers/author.auth");
// const { AuthorRouter } = require("./routes/Author.route");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/user", UserRouter);

app.get("/", (req, res) => {
  res.send("Hello BE");
});

// app.get("/blogs", authorAuth, (req, res) => {
//   return res.status(200).send({ reports: [{ "report 1": "asdfdas" }] });
// });

app.listen(process.env.PORT || 5001, async () => {
  try {
    await connection;
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
    console.log("DB ERROR");
  }
  console.log("Listing ");
});
