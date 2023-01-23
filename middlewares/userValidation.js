const express = require("express");

const userrValidation = (req, res, next) => {
  if (req.method == "POST") {
    const info = req.body;
    if (info.name && info.username && info.email && info.password) {
      next();
    } else {
      res.status(401).send({ result: false, msg: "Field Required" });
    }
  } else {
    res.status(400).send({ result: false, msg: "Bad Request ok" });
  }
};

module.exports = { userrValidation };
