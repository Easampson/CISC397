const Models = require('./models/indexmodel');

module.exports = {
  DoesUserExist: function (mongoclient, url, usrcred){
    return new Promise( (resolve, reject) => {
      synchronousSearch( resolve, reject, mongoclient, url, usrcred, searchForUser);
    });
  },
  RegisterUser: function (mongoclient, url, usrcred){
    return new Promise( (resolve, reject) => {
      synchronousSearch( resolve, reject, mongoclient, url, usrcred, registerUser);
    });
  },
  UserTagLists: function (mongoclient, url, vm){
    return new Promise( (resolve, reject) => {
      synchronousSearch( resolve, reject, mongoclient, url, vm, usertaglists);
    });
  },
  RetrieveUserTagList: function (mongoclient, url, vm){
    return new Promise( (resolve, reject) => {
      synchronousSearch( resolve, reject, mongoclient, url, vm, retrievetaglist);
    });
  },
  AddNewUserTagList: function (mongoclient, url, vm){
    return new Promise( (resolve, reject) => {
      synchronousSearch( resolve, reject, mongoclient, url, vm, newusertaglist);
    });
  },
  AddMarkerToList: function (mongoclient, url, vm){
    return new Promise( (resolve, reject) => {
      synchronousSearch( resolve, reject, mongoclient, url, vm, addmarkertolist);
    });
  },
  searchHistoryForMap: function (mongoclient, url, vm){

     var queryobject = new Models.SearchFormModel(vm);
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
function synchronousSearch(resolve, reject, mc, url, key, function_name){

   mc.connect(url)
   .then( (client) => {
        if ( key != null){
          function_name(resolve, reject, client, key);
        }
      }).catch( (err) =>{console.log(err)});
}

function registerUser (resolve, reject, client, key){
  var db = client.db('PHF');

  db.collection('users').insert(new Models.RegisterUserModel(key))
      .then( (list) => {
          resolve('1');
      }, (err)=>{
          resolve('0');
      });
}

function searchForUser(resolve, reject, client, key){

  var db = client.db('PHF');
  db.collection('users').find(key)
      .toArray( (err, list) => {
          (list.length > 0 ) ? resolve('1'):resolve('0');
      });
}

function usertaglists(resolve, reject, client, vm){
  var db = client.db('PHF');
  db.collection('usertags').find({ user:vm.usrname})
      .toArray( (err, list) => {
          var results = {};
          results.items = [];
          if (list.length > 0){
            list[0].lists.forEach( (el, i) => {
                results.items.push(new Models.Select2ModelFromUserTagLists(el.name));
            });
          }
          client.close();
          resolve(results);
      });
}

function retrievetaglist(resolve, reject, client, vm){
  var db = client.db('PHF');
  db.collection('usertags').find({ user:vm.usrname, 'lists.name': vm.listname})
      .toArray( (err, list) => {
          var results = {};
          results.items = [];
          if (list.length > 0){
            list[0].lists.forEach( (el, i) => {
              el.markers.forEach( (m, i) => {
                console.log(m);
                results.items.push(new Models.ModelFromUserTagList(m));
              });
            });
          }
          client.close();
          resolve(results);
      });
}
function newusertaglist(resolve, reject, client, key){
  var db = client.db('PHF');

  db.collection('usertags').update({user: key.User}, {'$push': { lists: { name:key.NameOfList, markers: []} }}, {upsert:true} )
  .then( (result) =>{
    console.log(result);
    resolve('1');
  },
    (err) => {
      console.log(err);
      resolve(err);
    });

}
function addmarkertolist(resolve, reject, client, key){
  var db = client.db('PHF');
  console.log(key);
  db.collection('usertags').update({user: key.User, 'lists.name': key.ListName}, {'$push': { 'lists.$.markers': { Title:key.Title, Description:key.Description } }} )
  .then( (result) =>{
    resolve('1');
  });

}

function searchHistory(resolve, reject, client, searchkey){
  var results = new Models.SearchHistoryResultsModel(new Models.Log(searchkey));

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find(searchkey) // searchkey must be a queryobject
         .toArray( (err, list) => {
           if (list != null){

            list.forEach( (el, i) => {
              var i2 = list.findIndex(e => e.Historical_Marker_Id === el.Historical_Marker_Id);
              if (i === i2){
                results.items.push(el);
                results.log.searchResults.push(el.Historical_Marker_Id);
              }
            });
            client.close();
           resolve(results);
          }
          client.close();
        });
}

function logSearchResults(resolve, reject, client, results){

    var db = client.db('PHF');
      db.collection('searchlogs').insert(results.log, { w: 1 }).then( (err, doc) =>{
        client.close();
        resolve(results.items);
      }, (err) =>{
        console.log(err);
      });
}

function searchMarker(resolve, reject, client, searchkey){
  var results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {Name_of_the_Marker: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {

           if (list != null){

            list.forEach( (el, i) => {
              var i2 = list.findIndex(e => e.Historical_Marker_Id === el.Historical_Marker_Id);
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
  var results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {County: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {

           if (list != null){
            list = list.filter( (el, i) => {
              var i2 = list.findIndex(e => e.County === el.County);
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
  var results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
  var db = client.db('PHF');
  db.collection('markers').find( {Category: {$regex: new RegExp(searchkey)}})
         .toArray( (err, list) => {
           if (list != null){
            list = list.filter( (el, i) => {
              var i2 = list.findIndex(e => e.Category === el.Category);
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
  var results = {};
  results.items = [];

  // queries for records with sub string searchkey
  // duplicates are then removed by searching the index
        var db = client.db('PHF');
        db.collection('markers').find( {Location_Description: {$regex: new RegExp(searchkey)}})
               .toArray( (err, list) => {
                 if (list != null){
                  list = list.filter( (el, i) => {
                    var i2 = list.findIndex(e => e.Location_Description === el.Location_Description);
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
