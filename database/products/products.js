var paintings = require("./products-paintings");
var glass = require("./products-glass");
var jewelry = require("./products-jewelry");
var sculptures = require("./products-sculptures");
var furniture = require("./products-furniture");
var objetDArt = require("./products-objetDArt");
var ceramics = require("./products-ceramics");
var porcelain = require("./products-porcelain");
var silver = require("./products-silver");
var clocks = require("./products-clocks");
var newArrivals = require("./products-newArrivals");

var products = {
  ...paintings.paintings,
  ...glass.glass,
  ...jewelry.jewelry,
  ...sculptures.sculptures,
  ...furniture.furniture,
  ...objetDArt.objectDArt,
  ...ceramics.ceramics,
  ...porcelain.porcelain,
  ...silver.silver,
  ...clocks.clocks,
  ...newArrivals.newArrivals,
};

module.exports = {
  products
}

