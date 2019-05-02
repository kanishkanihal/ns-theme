const BigCommerce = require("node-bigcommerce");
let redis = require("redis");
require("dotenv").config();
const client = require("../helpers/db").client;
const page = require("../models/page");
const widget = require("../models/widget");

/* Authorization */
var auth = async (req, res, next) => {
  let bigCommerce = new BigCommerce({
    clientId: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    callback: process.env.CALLBACK,
    responseType: "json"
  });
  try {
    var data = await bigCommerce.authorize(req.query);
    let userId = data.user.id;
    //Save on redis
    client.set(userId, JSON.stringify(data), redis.print);
    //View
    res.render("integrations/auth", { title: "Authorized!", data: data });
  } catch (err) {
    next(err);
  }
};

/* Load */
var load = async (req, res, next) => {
  let bigCommerce = new BigCommerce({
    secret: process.env.CLIENT_SECRET,
    responseType: "json"
  });
  try {
    const customerData = await bigCommerce.verify(req.query["signed_payload"]);
    let userId = customerData.user.id;
    //Get menu page
    let menu = await page.getMenuPage(userId);
    let home = await widget.getHomePageContent(userId);
    //View
    let data = {
      data: customerData,
      menu: menu,
      home: home
    };
    res.render("integrations/welcome", { title: "Welcome!", data: data });
  } catch (err) {
    next(err);
  }
};

/* Uninstall */
var uninstall = async (req, res, next) => {
  let bigCommerce = new BigCommerce({
    secret: process.env.CLIENT_SECRET,
    responseType: "json"
  });
  try {
    const data = await bigCommerce.verify(req.query["signed_payload"]);
    //Delete redis
    let userId = data.user.id;
    client.del(userId, (error, result) => {
      if (error) {
        throw error;
      } else {
        console.log("Deleted Successfully!");
      }
    });
    //View
    res.render("integrations/uninstall", {
      title: "Uninstalled",
      data: data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { auth, load, uninstall };
