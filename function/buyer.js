const express = require("express");
const prisma = require("../prisma/db.js");
const app = express();

const home = (req, res) => {
    res.render('home');
}

module.exports = {home}