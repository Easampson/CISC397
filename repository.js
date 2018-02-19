const Models = require('./models/indexmodel');

module.exports = {
  searchHistoryForMap: function (mongoclient, url, vm){

     // build new query object from vm
     let queryobject = Models.SearchFormModel;

     if (vm.Historical_Marker_Id != '') {queryobject.Historical_Marker_Id = vm.Historical_Marker_Id}
     if (vm.Category != '') {queryobject.Category = vm.Category}
     if (vm.County != '') {queryobject.County = vm.County}
     if (vm.Location_Description != '') {queryobject.Location_Description = vm.Location_Description}

     // query db
     return new Promise( (resolve, reject) => {
       synchronousSearch(resolve, reject, mongoclient, url, queryobject, searchHistory);
     });
  },
  searchInMarkerList: function(mongoclient, url, searchkey){
    return new Promise( (resolve, reject) => {
      synchronousSearch(resolve, reject, mongoclient, url, searchkey, searchMarker);
    });
  },
  searchCountyList: function(mongoclient, url, searchkey){
    return new Promise( (resolve, reject) => {
      synchronousSearch(resolve, reject, mongoclient, url, searchkey, searchCounty);
      });
  },
  searchCategoryList: function(mongoclient, url, searchkey){
    return new Promise( (resolve, reject) => {
      synchronousSearch(resolve, reject, mongoclient, url, searchkey, searchCategory);
    });
  },
  searchLocationDescriptionList: function(mongoclient, url, searchkey){
    return new Promise( (resolve, reject) => {
      synchronousSearch(resolve, reject, mongoclient, url, searchkey, searchLocationDescription);
    });
  }

}

// function to syncrhonize select2 searching by wrapping promise-then template
// on connect
// removes code that is repeated throughout above
function synchronousSearch(resolve, reject, mc, url, searchkey, select2search){

       mc.connect(url)
       .then( (client) => {
            if ( searchkey != null){
              select2search(resolve, reject, client, searchkey);
            }
          }).catch( (err) =>{console.log(err)});
}

function searchHistory(resolve, reject, client, searchkey){
  let results = {};
  let items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find(searchkey) // searchkey must be a queryobject
         .toArray( (err, list) => {
           if (list != null){
             console.log(list);

            list = list.filter( (el, i) => {
              let i2 = list.findIndex(e => e.Historical_Marker_Id === el.Historical_Marker_Id);
               return (i === i2) ? true:false;
            });

           client.close();
           results.items = list;
           resolve(results);
         }
         });

}


function searchMarker(resolve, reject, client, searchkey){
  let results = {};
  let items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {Name_of_the_Marker: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {
           if (list != null){
            list = list.filter( (el, i) => {
              let i2 = list.findIndex(e => e.Historical_Marker_Id === el.Historical_Marker_Id);
               return (i === i2) ? true:false;
            });
             list.forEach(function(el){
               items.push({ id: el.Historical_Marker_Id, text: el.Name_of_the_Marker });
           });
           client.close();
           results.items = items;
           resolve(results);
         }
         });
}

function searchCounty(resolve, reject, client, searchkey){
  let results = {};
  let items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {County: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {
           if (list != null){
            list = list.filter( (el, i) => {
              let i2 = list.findIndex(e => e.County === el.County);
               return (i === i2) ? true:false;
            });
             list.forEach(function(el){
               items.push({ id: el.County, text: el.County });
           });
           client.close();
           results.items = items;
           resolve(results);
         }
         });
}


function searchCategory(resolve, reject, client, searchkey){
  let results = {};
  let items = [];
  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {Category: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {
           if (list != null){
            list = list.filter( (el, i) => {
              let i2 = list.findIndex(e => e.Category === el.Category);
               return (i === i2) ? true:false;
            });
             list.forEach(function(el){
               items.push({ id: el.Category, text: el.Category });
           });
           client.close();
           results.items = items;
           resolve(results);
         }
         });
}

function searchLocationDescription(resolve, reject, client, searchkey){
  let results = {};
  let items = [];
  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
        var db = client.db('PHF');
        db.collection('markers').find( {Location_Description: {$regex: new RegExp(searchkey)}})
               .toArray( (err, list) => {
                 if (list != null){
                  list = list.filter( (el, i) => {
                    let i2 = list.findIndex(e => e.Location_Description === el.Location_Description);
                     return (i === i2) ? true:false;
                  });
                   list.forEach(function(el){
                     items.push({ id: el.Location_Description, text: el.Location_Description });
                 });
                 client.close();
                 results.items = items;
                 resolve(results);
               }
               });
}
