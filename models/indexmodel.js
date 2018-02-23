

module.exports = {

  SearchFormModel : function(vm){
      if (vm.Historical_Marker_Id != '') {this.Historical_Marker_Id = vm.Historical_Marker_Id}
      if (vm.Category != '') {this.Category = vm.Category}
      if (vm.County != '') {this.County = vm.County}
      if (vm.Location_Description != '') {this.Location_Description = vm.Location_Description}
  },
  SearchHistoryResultsModel: function(st){
    this.items = [];
    this.log = {};
    this.log.searchTerm = st;
    this.log.searchResults = [];
  },
  RegisterUserModel: function(usrcred){
    this.Username = usrcred.Username;
    this.Password = usrcred.Password;
    this.SessionID = '';
  },
  UserTagListsModel: function (vm){
    this.Username = vm.Username;
    this.Term = vm.term;
  },
  Select2ModelFromUserTags: function(obj){
    this.id = obj[0];
    this.text = obj[0];
  }
}
