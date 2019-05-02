const BigCommerce = require("node-bigcommerce");
let redis = require("redis");
require("dotenv").config();
const client = require("../helpers/db").client;
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

//Bigcommerce
const bc = async userId => {
  try {
    var t = await getAsync(userId);
    var x = JSON.parse(t);
    try {
      const bigCommerce = new BigCommerce({
        clientId: process.env.CLIENT_ID,
        accessToken: x.access_token,
        storeHash: x.context.split("/")[1],
        responseType: "json"
      });
      return bigCommerce;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

//Get all pages
const getAllPages = async userId => {
  const bigCommerce = await bc(userId);
  try {
    let pages = await bigCommerce.get("/pages");
    return pages;
  } catch (error) {
    console.log(error);
  }
};

//Create new menu page
const newMenuPage = async userId => {
  const bigCommerce = await bc(userId);
  try {
    let menu = {
      type: "raw",
      name: "Menu",
      url: "/menu/",
      body: "<ul></ul>",
      mobile_body: 0,
      has_mobile_version: false,
      is_visible: false,
      is_homepage: false,
      sort_order: 0
    };
    let page = await bigCommerce.post("/pages", menu);
    return page;
  } catch (error) {
    console.log(error);
  }
};

//Get menu page
const getMenuPage = async userId => {
  //Get all pages
  let pages = await getAllPages(userId);
  //Filter by type & url
  let menu = await pages.filter(page => {
    if (page.type === "raw" && page.url === "/menu/") return page;
  });
  if (menu.length === 1) {
    //Menu page exist.
    return menu;
  } else {
    //Menu page does not exist, So create new.
    let newMenu = await newMenuPage(userId);
    return newMenu;
  }
  return menu;
};

//Update menu page
const putMenuPage = async data => {
  let userId = data.userId;
  let id = data.id;
  let menu = { body: data.menu };

  const bigCommerce = await bc(userId);
  try {
    let page = await bigCommerce.put(`/pages/${id}`, menu);
    return { status: true, page: page };
  } catch (error) {
    return { status: false };
  }
};

module.exports = { getAllPages, getMenuPage, putMenuPage };
