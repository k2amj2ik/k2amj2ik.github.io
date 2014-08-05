app = angular.module("myApp", []);


//app.controller("mainCtrl", ["$scope", "personService", function($scope, personService){}]);

app.controller("mainCtrl", function($scope) {
  $scope.name = "Default Name";
  $scope.people = [];
  $scope.savePerson = function() {
    $scope.people.push[$scope.name];
    alert($scope.name);
    $scope.name = '';
  };
});


app.directive("alertable", function () {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      element.bind("click", function() {
        alert(attrs.message);
      });
    }
  };
});


app.factory("personService", function() {
  var personService = {};
  personService.people = [];
  personService.addPerson = function(person) {
    personService.people.push(person);
  };
  return personService;
});



//app.config(function ($routeProvider) {
//  $routeProvider.when("/", {
//    templateUrl: "templates/home.html",
//    controller: "homepageCtrl"
//  });
//  $routeProvider.when("/person/:id", {
//    templateUrl: "templates/profile.html",
//    controller: "profileCtrl"
//  });
//});