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



stockApp.controller( 'listQuotesController', function($scope, tracked, displayStocks) {
  let quote = [];
  $scope.stockList = quote;
  
  tracked.read(function(res) {
    // console.log('res:', res);
    $scope.trackedStocks = res.data;
    displayStocks.listBuilder(res.data, function(data) {
      // console.log(data);
      // console.log(data.Symbol);
      // console.log(data.LastPrice);
      quote.push({name: data.Symbol, price: data.LastPrice});
      console.log(quote)

    });
  })
})

stockApp.service("displayStocks", function($http){
  
  this.listBuilder = function(stockArr, cb){
    for (let i of stockArr){
    this.getStocks(i , cb);
   }

  }
  this.getStocks = function(symbol, cb){
     return  $http.jsonp(`http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=${symbol}&callback=JSON_CALLBACK`)
     .success(function(data) {
      cb(data);
      }) ; 
  }



});


stockApp.controller('mainController', function($scope){
});

stockApp.controller('addStockController', function($scope, stockService, tracked){

  $scope.populateTextArea = function(stockItem) {
    var symbol = stockItem.Symbol;
    $scope.company = symbol;
  }
  $scope.trackInput = function(){
    stockService.getStocks($scope.company)
    .success(function(data){
      $scope.stockList = data;
    });
  }
  tracked.read(function(res) {
    $scope.trackedStocks = res.data;
  })
  $scope.addTracked = function() {
    tracked.add($scope.company)
    .then(function(data) {
      $scope.trackedStocks = data.data;
    })
  }
});

stockApp.service("stockService", function($http){
  this.getStocks = function(company){
    return $http.jsonp(`http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=${company}&callback=JSON_CALLBACK`)
  }
});

stockApp.factory('tracked', function($http) {
  var tracked = function() {};
    tracked.read = function(cb) {
      $http.get('http://localhost:3000/tracked')
      .then(function(res) { 
        cb(res)});
    };
    
    tracked.add =function(symbol) {
      return $http.post('http://localhost:3000/tracked', {newSymbol: symbol})
    }
  return tracked;
});