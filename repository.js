const Models = require('./models/indexmodel');

module.exports = {
  searchHistoryForMap: function (mongoclient, url, vm){

     // build new query object from vm
     let queryobject = new Models.SearchFormModel();

     if (vm.Historical_Marker_Id != '') {queryobject.Historical_Marker_Id = vm.Historical_Marker_Id}
     if (vm.Category != '') {queryobject.Category = vm.Category}
     if (vm.County != '') {queryobject.County = vm.County}
     if (vm.Location_Description != '') {queryobject.Location_Description = vm.Location_Description}

     // query db
     return new Promise( (resolve, reject) => {
       synchronousSearch( resolve, reject, mongoclient, url, queryobject, searchHistory);
     });

  },
  logSearchTermAndResults: function(mongoclient, url, results){
    return new Promise( (resolve, reject) => {
      synchronousSearch( resolve, reject, mongoclient, url, results, logSearchResults);
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
function synchronousSearch(resolve, reject, mc, url, key, select2search){

       mc.connect(url)
       .then( (client) => {
            if ( key != null){
              select2search(resolve, reject, client, key);
            }
          }).catch( (err) =>{console.log(err)});
}

function searchHistory(resolve, reject, client, searchkey){
  let results = new Models.SearchHistoryResultsModel();
  results.items = [];
  results.log = {};
  results.log.searchTerms = searchkey;
  results.log.logresults = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find(searchkey) // searchkey must be a queryobject
         .toArray( (err, list) => {
           if (list != null){

            list.forEach( (el, i) => {
              let i2 = list.findIndex(e => e.Historical_Marker_Id === el.Historical_Marker_Id);
              if (i === i2){
                results.items.push(el);
                results.log.logresults.push(el.Historical_Marker_Id);
              }
            });
           resolve(results);
          }
          client.close();
        });
}

function logSearchResults(resolve, reject, client, results){

    let db = client.db('PHF');
      db.collection('searchlogs').insert(results.log, { w: 1 }).then( (err, doc) =>{
        client.close();
        resolve(results.items);
      }, (err) =>{
        console.log(err);
      });
}

function searchMarker(resolve, reject, client, searchkey){
  let results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {Name_of_the_Marker: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {

           if (list != null){

            list.forEach( (el, i) => {
              let i2 = list.findIndex(e => e.Historical_Marker_Id === el.Historical_Marker_Id);
               if (i === i2){
                 results.items.push({ id: el.Historical_Marker_Id, text: el.Name_of_the_Marker+'-'+el.Dedicated_Year });
               }
            });

           client.close();
           resolve(results);
         }
         client.close();

         });
}

function searchCounty(resolve, reject, client, searchkey){
  let results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {County: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {

           if (list != null){
            list = list.filter( (el, i) => {
              let i2 = list.findIndex(e => e.County === el.County);
               if (i === i2){
                 results.items.push({ id: el.County, text: el.County });
               }
            });

           client.close();
           resolve(results);
         }
         client.close();

         });
}


function searchCategory(resolve, reject, client, searchkey){
  let results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {Category: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {
           if (list != null){
            list = list.filter( (el, i) => {
              let i2 = list.findIndex(e => e.Category === el.Category);
               if (i === i2) {
                 results.items.push({ id: el.Category, text: el.Category });
               }
            });

           client.close();
           resolve(results);
         }
         client.close();

         });
}

function searchLocationDescription(resolve, reject, client, searchkey){
  let results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
        var db = client.db('PHF');
        db.collection('markers').find( {Location_Description: {$regex: new RegExp(searchkey)}})
               .toArray( (err, list) => {
                 if (list != null){
                  list = list.filter( (el, i) => {
                    let i2 = list.findIndex(e => e.Location_Description === el.Location_Description);
                     if (i === i2) {
                       results.items.push({ id: el.Location_Description, text: el.Location_Description });
                     }
                  });

                 client.close();
                 resolve(results);
               }
               client.close();

               });
}
