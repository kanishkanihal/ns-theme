var express = require("express");
var router = express.Router();
const BigCommerce = require("node-bigcommerce"); //
var indexController = require("../controllers/indexController");
var pageController = require("../controllers/pageController");
var contentController = require("../controllers/contentController");
require("dotenv").config();

/* Authorization */
router.get("/auth", indexController.auth);

/* Load */
router.get("/load", indexController.load);

/* Uninstall */
router.get("/uninstall", indexController.uninstall);

/*Update the menu content */
router.post("/page", pageController.updatePage);

/*Update the home content */
router.post("/content", contentController.updateContent);

/* Uninstall */
router.get("/cors", (req, res, next) => {
  console.log("kana");
  res.json({ a: 1 });
});

router.get("/test", (req, res, next) => {
  console.log("kana");
  res.send(
    "<script>console.log(\"skana\");fetch('http://localhost:3000/cors').then(response => response.json()).then(data => {console.log(data)}).catch(error => console.error(error))</script>"
  );
});

module.exports = router;
