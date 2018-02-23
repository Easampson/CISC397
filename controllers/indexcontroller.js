const Repository = require('../repository');
const MongoClient = require('mongodb').MongoClient;
const Models = require('../models/indexmodel');
const RandomString = require("randomstring");

module.exports = {

  Login:function (req, res){
      res.render('login');
  },
  LoginSubmit:function (req, res, url){
    Repository.DoesUserExist(MongoClient, url, req.body).then( (result) =>{
      console.log(req.body.Username);
        // send back cookie
        if (result != '0'){
          res.send({
            Username: req.body.Username
          });
        }else {
          res.send(result);
        }

    });
  },
  SignUp: function (req, res){
      res.render('signup');
  },
  SignUpSubmit:function (req, res, url){
    Repository.RegisterUser(MongoClient, url, req.body).then( (result) =>{
      // send back cookie
      if (result == '1'){
        res.send({
          Username: req.body.Username
        });
      }else {
        res.send(result);
      }

    });
  },
  UserTagLists: function(req, res, url, key){
    Repository.UserTagLists(MongoClient, url, key).then( (items) => {
      res.send(items);
    });
  },
  HomePage: function(req, res){
    res.render('index');
  },
  SearchHistoryForMap: function (req, res, url, vm){

    if (req.body.Username == null || req.body.Username == ""){
      res.send('0');
      return;
    }

    Repository.searchHistoryForMap(MongoClient, url, vm).then( (items) => {
     Repository.logSearchTermAndResults(MongoClient, url, items).then( (loggeditems) => {
       res.send(loggeditems);
     });
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
