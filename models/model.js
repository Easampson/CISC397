

module.exports = {

  SearchFormModel : function(vm){
      if (vm.Historical_Marker_Id != '') {this.Historical_Marker_Id = parseInt(vm.Historical_Marker_Id)}
      if (vm.Category != '') {this.Category = vm.Category}
      if (vm.County != '') {this.County = vm.County}
      if (vm.Location_Description != '') {this.Location_Description = vm.Location_Description}
  },
  SearchHistoryModel: function(searchkey){
    if (searchkey.Historical_Marker_Id != '' && !isNaN(searchkey.Historical_Marker_Id) ){
      this.Historical_Marker_Id = parseInt(searchkey.Historical_Marker_Id);
    }
    if (searchkey.Category != undefined ) {this.Category = searchkey.Category}
    if (searchkey.County != undefined ) {this.County = searchkey.County}
    if (searchkey.Location_Description != undefined ) {this.Location_Description = searchkey.Location_Description}
  },
  SearchHistoryResultsModel: function(_log){
    this.items = [];
    this.log = _log;
  },
  Log: function (st){
    this.searchTerm = st;
    this.searchResults = [];
  },
  RegisterUserModel: function(usrcred){
    this.Username = usrcred.Username;
    this.Password = usrcred.Password;
  },
  UserTagListsModel: function (vm){
    this.user = vm.Username;
    this.Term = vm.term;
  },
  Select2ModelFromUserTags: function(obj){
    this.id = obj[0];
    this.text = obj[0];
  },
  Select2ModelFromUserTagLists: function(listname){
    this.id = listname;
    this.text = listname;
  },
  ModelFromUserTagList: function(vm){
    this.Title = vm.Title;
    this.Description = vm.Description;
  },
  TagMarkerModel: function (vm){
    this.Title = vm.Title;
    this.Description = vm.Description;
  }
}
