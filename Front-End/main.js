'use strict';

let stockApp = angular.module('stockApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

    $stateProvider
    .state("home", {
      url: '/',
      templateUrl : "pages/home.html",
      controller  : "mainController"
    })

    .state('addStock', {
      url: '/addStock',
      templateUrl : 'pages/addStock.html',
      controller  : 'addStockController'
    })

    .state('listQuotes', {
      url: '/listQuotes',
      templateUrl : 'pages/listQuotes.html',
      controller  : 'listQuotesController'
    })
});

stockApp.controller( 'listQuotesController', function($scope) {
  console.log('list');
})

stockApp.controller('mainController', function($scope){
});

stockApp.controller('addStockController', function($scope, stockService, tracked){

  $scope.populateTextArea = function(stockItem) {
    var symbol = stockItem.Symbol;
    console.log(symbol);
    $scope.company = symbol;
  }
  $scope.trackInput = function(){
    stockService.getStocks($scope.company)
    .success(function(data){
      $scope.stockList = data;
      console.log($scope.stockList);
    });
  }
  tracked.read()
  .then(function(res) {
    console.log('res:', res.data);
    $scope.trackedStocks = res.data;
  })
    .catch(function(e) {
      console.log('error', e)
    })
  $scope.addTracked = function() {
    tracked.add($scope.company)
    .then(function(data) {
      console.log('data', data.data);
      $scope.trackedStocks = data.data;
    })
  }
});

stockApp.service("stockService", function($http){
  this.getStocks = function(company){
    console.log("ok");
    return $http.jsonp(`http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=${company}&callback=JSON_CALLBACK`)
  }
});

stockApp.factory('tracked', function($http) {
  var tracked = function() {};
    tracked.read = function() {
      return $http.get('http://localhost:3000/tracked')
    };
    
    tracked.add =function(symbol) {
      console.log(symbol);
      return $http.post('http://localhost:3000/tracked', {newSymbol: symbol})
    }
  return tracked;
});