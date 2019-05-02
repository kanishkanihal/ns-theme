const widget = require("../models/widget");

var updateContent = async (req, res, next) => {
  let status = await widget.putHomeWidget(req.body);
  return res.json(status);
};

module.exports = { updateContent };
