const Repository = require('../repository');
const MongoClient = require('mongodb').MongoClient;
const Models = require('../models/indexmodel');

module.exports = {

  HomePage: function(req, res){
    res.render('index');
  },
  SearchHistoryForMap: function (req, res, url, vm){
    Repository.searchHistoryForMap(MongoClient, url, vm).then( (items) => {
    res.send(items);
  });
  },
  NameOfMarkerList: function(req, res, url, term){
    Repository.searchInMarkerList(MongoClient, url, term).then( (items) => {
      res.send(items);
    });
  },
  CountyList: function(req, res, url, term){
    Repository.searchCountyList(MongoClient, url, term).then( (items) => {
      res.send(items);
    });
  },
  CategoryList: function(req, res, url, term){
    Repository.searchCategoryList(MongoClient, url, term).then( (items) => {
      res.send(items);
    });
  },
  LocationDescriptionList: function(req, res, url, term){
    Repository.searchLocationDescriptionList(MongoClient, url, term).then( (items) => {
    res.send(items);
  });
  },
}
