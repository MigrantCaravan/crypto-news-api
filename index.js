const PORT = process.env.PORT || 4000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const newspapers = [
  {
    name: "cbc",
    address: "https://www.cbc.ca/news",
    base: "",
  },
  {
    name: "cointelegraph",
    address: "https://cointelegraph.com/",
    base: "https://cointelegraph.com",
  },
  {
    name: "globalnews",
    address: "https://globalnews.ca/money/",
    base: "",
  },
  {
    name: "coinsquare",
    address: "https://news.coinsquare.com/",
    base: "",
  },
  {
    name: "coinsdesk",
    address: "https://www.coindesk.com/",
    base: "",
  },
  {
    name: "globeandmail",
    address: "https://www.theglobeandmail.com/business/",
    base: "",
  },
  {
    name: "cryptoslate",
    address: "https://cryptoslate.com/places/canada/",
    base: "",
  },
  {
    name: "thestar",
    address: "https://www.thestar.com/business/personal_finance.html",
    base: "https://www.thestar.com",
  },
  {
    name: "newswire",
    address: "https://www.newswire.ca/",
    base: "",
  },
  {
    name: "bloomberg",
    address: "https://www.bnnbloomberg.ca/crypto",
    base: "https://www.bnnbloomberg.ca",
  },
  {
    name: "ctvnews",
    address: "https://www.ctvnews.ca/business",
    base: "",
  },
  {
    name: "fool",
    address: "https://www.fool.ca/",
    base: "",
  },
  {
    name: "mondaq",
    address: "https://www.mondaq.com/1/Canada",
    base: "",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("crypto")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })

  ////----------END POINTS----------////

  .get(`/`, (req, res) => {
    res.json({
      message: "Welcome to the API",
    });
  })

  .get(`/news`, (req, res) => {
    res.json(articles);
  })

  .get(`/news/:id`, (req, res) => {
    const id = req.params.id;
    const article = newspapers.filter((newspaper) => newspaper.name === id)[0]
      .address;
    const newspaperBase = newspapers.filter(
      (newspaper) => newspaper.name === id
    )[0].base;
    axios
      .get(article)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticle = [];
        $('a:contains("crypto")', html).each(function () {
          const title = $(this).text();
          const url = $(this).attr("href");
          specificArticle.push({
            title,
            url: newspaperBase + url,
            source: id,
          });
        });
        res.json(specificArticle);
      })
      .catch((err) => {
        console.log(err);
      });
  })

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
