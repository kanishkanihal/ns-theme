const page = require("../models/page");

var updatePage = async (req, res, next) => {
  let status = await page.putMenuPage(req.body);
  res.json(status);
};

module.exports = { updatePage };
