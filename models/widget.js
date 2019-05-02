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
        apiVersion: "v3",
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
const getAllRegions = async userId => {
  const bigCommerce = await bc(userId);
  try {
    let regions = await bigCommerce.get(
      "/content/regions?templateFile=pages/home"
    );
    return regions;
  } catch (error) {
    console.log(error);
  }
};

const getAllTemplates = async userId => {
  const bigCommerce = await bc(userId);
  try {
    let templates = await bigCommerce.get("/content/widget-templates");
    return templates;
  } catch (error) {
    console.log(error);
  }
};

const newTemplate = async userId => {
  const bigCommerce = await bc(userId);
  try {
    let content = {
      name: "Home Page Content",
      template:
        '<div class="home-whisky-category-containe"> <div class="home-whisky-category-wrapper"> {{#each images}} <div class="home-whisky-category-item {{#if @index \'===\' 0}}double  {{else}}  {{#if  @index \'===\' 3}} double {{/if}}{{/if}}"> <a href=""> <img src={{image_source}} alt=""> <div class="category-info"> <h3 class="title">{{image_heading}}</h3> <p class="desc">{{image_description}}</p> </div> </a> </div> {{/each}} </div> </div>'
    };
    let template = await bigCommerce.post("/content/widget-templates", content);
    return template;
  } catch (error) {
    console.log(error);
  }
};
const getAllWidgets = async userId => {
  const bigCommerce = await bc(userId);
  try {
    let widgets = await bigCommerce.get("/content/widgets");
    return widgets;
  } catch (error) {
    console.log(error);
  }
};
const newWidget = async (userId, templateId) => {
  const bigCommerce = await bc(userId);
  try {
    let widgetContent = {
      name: "Home Page Widget",
      widget_configuration: {
        images: [
          {
            image_heading: "مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة م",
            image_source:
              "https://blog.freepeople.com/wp-content/uploads/2016/04/02-8.jpg",
            image_description:
              "也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计"
          },
          {
            image_heading: "տպագրության և տպագրական",
            image_source:
              "http://image.desk7.net/Models%20Wallpapers/4042_1280x800.jpg",
            image_description:
              "छपाई और अक्षर योजन उद्योग का एक साधारण डमी पाठ है. Lorem Ipsum सन १५०० के बाद से अभी तक इस उद्योग का मानक डमी पाठ मन गया, जब एक अज्ञात मुद्रक ने नमूना लेकर एक नमूना किताब बनाई. यह न केवल पाँच सदियों से जीवित रहा बल्कि इसने इलेक्ट्रॉनिक मीडिया में छलांग लगाने के बाद भी"
          },
          {
            image_heading: "Είναι πλέον κοινά παραδεκτό ότι ένας αναγνώστης",
            image_source:
              "https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/03/03/15/woman-smoothie-phone.jpg",
            image_description:
              "είναι απλά ένα κείμενο χωρίς νόημα για τους επαγγελματίες της τυπογραφίας και στοιχειοθεσίας. Το Lorem Ipsum είναι το επαγγελματικό πρότυπο όσον αφορά το κείμενο χωρίς νόημα, από τον 15ο αιώνα, όταν ένας ανώνυμος τυπογράφος πήρε ένα δοκίμιο και ανακάτεψε τις λέξεις για να δημιουργήσει ένα δείγμα βιβλίου."
          }
        ]
      },
      widget_template_uuid: templateId
    };
    let widget = await bigCommerce.post("/content/widgets", widgetContent);
    return widget;
  } catch (error) {
    console.log(error);
  }
};

const getAllPlacements = async userId => {
  const bigCommerce = await bc(userId);
  try {
    let placements = await bigCommerce.get("/content/placements");
    return placements;
  } catch (error) {
    console.log(error);
  }
};

const newPlacement = async (userId, widgetId) => {
  const bigCommerce = await bc(userId);
  try {
    let content = {
      widget_uuid: widgetId,
      template_file: "pages/home",
      status: "active",
      sort_order: 1,
      region: "home-content-section"
    };
    let placement = await bigCommerce.post("/content/placements", content);
    return placement;
  } catch (error) {
    console.log(error);
  }
};

const getHomePageContent = async userId => {
  //Get all reagions
  let regions = await getAllRegions(userId);
  //Filter by name
  let homePageRegion = await regions.data.filter(region => {
    if (region.name === "home-content-section") {
      return region;
    }
  });
  if (homePageRegion.length === 1) {
    //Home page content region exist. Get the template
    let templates = await getAllTemplates(userId);
    //Get home page template
    let homeContent = await templates.data.filter(template => {
      if (template.name === "Home Page Content") {
        return template;
      }
    });
    var homeContentTemplate = "";
    if (homeContent.length === 1) {
      //Template Exist.
      homeContentTemplate = homeContent[0];
    } else {
      //Template doesn't exist, Create new template.
      homeContentTemplate = await newTemplate(userId);
    }
    let templateUUID = homeContentTemplate.uuid;
    //Get all widgets
    let widgets = await getAllWidgets(userId);
    //Get home page widget
    let homeWidget = widgets.data.filter(widget => {
      if (widget.widget_template.uuid === templateUUID) {
        return widget;
      }
    });
    var homeContentWidget = "";
    if (homeWidget.length === 1) {
      //Widget exist
      homeContentWidget = homeWidget;
    } else {
      //Widget doesn't exist, Create a new one
      homeContentWidget = await newWidget(userId, homeContentTemplate.uuid);
    }
    let widgetUUID = homeContentWidget[0].uuid;
    //Placenment
    let placements = await getAllPlacements(userId);
    //Get home placement
    let homePlacement = placements.data.filter(placement => {
      if (placement.widget.uuid === widgetUUID) {
        return placement;
      }
    });
    var homeContentPlacement = "";
    if (homePlacement.length === 1) {
      //Placement exist
      homeContentPlacement = homePlacement;
    } else {
      //Placement doesn't exist, Create newone
      homeContentPlacement = newPlacement(userId, widgetUUID);
    }

    return homeContentWidget;
  } else {
    //Home page content region doesn't exist. There is no way of creating it in API
    return false;
  }

  console.log(homePageRegion);
};

let putHomeWidget = async data => {
  let userId = data.userId;
  let widgetId = data.widgetId;
  let widget = {
    widget_configuration: {
      images: JSON.parse(data.content)
    },
    widget_template_uuid: data.templateId
  };
  try {
    const bigCommerce = await bc(userId);
    let page = await bigCommerce.put(`/content/widgets/${widgetId}`, widget);
    return { status: true, page: page };
  } catch (error) {
    return { status: false };
  }
  //return JSON.parse(data.content);
};

module.exports = { getHomePageContent, putHomeWidget };
