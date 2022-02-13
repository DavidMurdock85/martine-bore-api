var newArrivals = require("./products-newArrivals");
var artByMaker = require("./products-artByMaker");
var artByPeriod = require("./products-artByPeriod");
var artByRegion = require("./products-artByRegion");
var clocks = require("./products-clocks");
var jewelry = require("./products-jewelry");
var paintings = require("./products-paintings");
var sold = require("./products-sold");
var tableware = require("./products-tableware");

var products = {
  ...newArrivals.newArrivals,
  ...paintings.paintings,
  ...artByPeriod.artByPeriod,
  ...artByRegion.artByRegion,
  ...artByMaker.artByMaker,
  ...tableware.tableware,
  ...clocks.clocks,
  ...jewelry.jewelry,
  ...sold.sold
};

module.exports = {
  products
}

