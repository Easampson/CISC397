

module.exports = {

  // search form model
  SearchFormModel : function(){
      //Historical_Marker_Id
      //Category
      //County
      //Location_Description
  },
  SearchHistoryResultsModel: function(){
    //items: { document records from MongoDB PHF//markers},
    //log: {
    //      searchTerm: {SearchFormModel},
    //      searchResults: ['Historical_Marker_Id',, 'Historical_Marker_Id',...]
    //     }
  }
}
