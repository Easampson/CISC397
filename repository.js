
module.exports = {

  searchOne: function (mongoclient, assert, url, dbname){
    mongoclient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected To MongoDB!!!");

      client.close();
    });

  },

  searchInMarkerList: function(mongoclient, url, term){
    let results = {};
    let items = [];

return new Promise( (resolve, reject) => {

     mongoclient.connect(url)
     .then( (client) => {
          if ( term != null){
            // queries for records with sub string term
            // duplicates are then removed by searching the index
            var db = client.db('PHF');
            db.collection('markers').find( {Name_of_the_Marker: {$regex: new RegExp(term)}})
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
          }).catch( (err) =>{console.log(err)});

        }); // end of return Promise

  },
  searchCountyList: function(mongoclient, url, term){
    let results = {};
    let items = [];

return new Promise( (resolve, reject) => {

     mongoclient.connect(url)
     .then( (client) => {
          if ( term != null){
            // queries for records with sub string term
            // duplicates are then removed by searching the index
            var db = client.db('PHF');
            db.collection('markers').find( {County: {$regex: new RegExp(term)}})
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
          }).catch( (err) =>{console.log(err)});

        }); // end of return Promise
      },
      searchCategoryList: function(mongoclient, url, term){
        let results = {};
        let items = [];

    return new Promise( (resolve, reject) => {

         mongoclient.connect(url)
         .then( (client) => {
              if ( term != null){
                // queries for records with sub string term
                // duplicates are then removed by searching the index
                var db = client.db('PHF');
                db.collection('markers').find( {Category: {$regex: new RegExp(term)}})
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
              }).catch( (err) =>{console.log(err)});

            }); // end of return Promise
          },
          searchLocationDescriptionList: function(mongoclient, url, term){
            let results = {};
            let items = [];

        return new Promise( (resolve, reject) => {

             mongoclient.connect(url)
             .then( (client) => {
                  if ( term != null){
                    // queries for records with sub string term
                    // duplicates are then removed by searching the index
                    var db = client.db('PHF');
                    db.collection('markers').find( {Location_Description: {$regex: new RegExp(term)}})
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
                  }).catch( (err) =>{console.log(err)});

                }); // end of return Promise
              }

}
