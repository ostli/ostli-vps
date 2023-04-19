const cheerio = require("cheerio");
const axios = require("axios");
const qs = require("querystring");

console.log(`\n开始获取搬瓦工最新优惠码\n`)
const instance = axios.create({
  baseURL: "https://bwh88.net/",
  timeout: 15000,
  maxRedirects: 0,
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || status === 302;
  },
});

(async function () {
  // 获取列表页
  const vps = await instance.get("vps-hosting.php");
  const $ = cheerio.load(vps.data);

  const vpsDetailPagePromises = [];

  // 获取vps列表
  $("div.bronze").each((index, element) => {
    // 获取vps详情页 类似：cart.php?a=add&pid=44
    const href = $(element).find("a").attr("href");
    // console.log(href);

    vpsDetailPagePromises.push(fetch302WithCookie(href));
  });

  // 获取详情页dom
  const vpsDetailHtmls = await Promise.all(vpsDetailPagePromises);
  // 获取优惠码
  let allPromoCode = vpsDetailHtmls.map(
    (vpsDetailHtml) => vpsDetailHtml.match(/Try this promo code: (\w*)/)[1]
  );
  // 过滤重复的
  allPromoCode = Array.from(new Set(allPromoCode));

  // console.log(allPromoCode);

  // 获取优惠率
  console.log(`--优惠码---折扣--`)
  allPromoCode.forEach(async (promoCode) => {
    // console.log(`===promoCode`, promoCode);
    const res = await instance.post(
      "cart.php?a=view",
      qs.stringify({
        promocode: promoCode,
      })
    );
    console.log(promoCode, res.data.match(/- ([\d\.]+%)/)[1]);
  });

})();

// 页面302时 要携带cookie
async function fetch302WithCookie(url) {
  const response = await instance.get(url);
  if (response.status === 302) {
    url = response.headers.location;
    return (
      await instance.get(url, {
        headers: {
          Cookie: response.headers["set-cookie"],
        },
      })
    ).data;
  } else {
    return response.data;
  }
}
