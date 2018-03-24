const Repository = require('../repository');
const MongoClient = require('mongodb').MongoClient;
const Models = require('../models/model');
const RandomString = require("randomstring");

module.exports = {

  Login:function (req, res){
      res.render('login');
  },
  LoginSubmit:function (req, res, url){
    Repository.DoesUserExist(MongoClient, url, req.body).then( (result) =>{
      console.log(req.body.Username);
      console.log(req.body.Password);
      
        // send back success or failure status to add cookie on clientside
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
  RetrieveUserTagList: function(req, res, url, key){
    Repository.RetrieveUserTagList(MongoClient, url, key).then( (items) => {
      res.send(items);
    });
  },
  AddNewUserTagList:function (req, res, url, key){
    Repository.AddNewUserTagList(MongoClient, url, key).then( (items) => {
      res.send(items);
    });
  },
  RemoveUserTagList:function (req, res, url, key){
    Repository.RemoveUserTagList(MongoClient, url, key).then( (items) => {
      res.send(items);
    });
  },
  AddMarkerToList:function (req, res, url, key){
    Repository.AddMarkerToList(MongoClient, url, key).then( (item) => {
      res.send(item);
    });
  },
  RemoveMarkerFromList:function (req, res, url, key){
    Repository.RemoveMarkerFromList(MongoClient, url, key).then( (item) => {
      res.send(item);
    });
  },
  HomePage: function(req, res){
    if (req.cookies.Username == '' || req.cookies.Username == null){
      res.render('login');
      return;
    }
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
  }
}
