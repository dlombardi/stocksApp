/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ function(module, exports) {

	'use strict';
	
	var stockApp = angular.module('stockApp', ['ngRoute']);
	
	stockApp.config(function ($routeProvider) {
	  $routeProvider.when("/", {
	    templateUrl: "pages/home.html",
	    controller: "mainController"
	  }).when('/addStock', {
	    templateUrl: 'pages/addStock.html',
	    controller: 'addStockController'
	  }).when('/listQuotes', {
	    templateUrl: 'pages/listQuotes.html',
	    controller: 'listQuotesController'
	  });
	});
	
	stockApp.controller('listQuotesController', function ($scope) {
	  console.log('list');
	});
	
	stockApp.controller('mainController', function ($scope) {});
	
	stockApp.controller('addStockController', function ($scope, stockService, tracked) {
	
	  $scope.populateTextArea = function (stockItem) {
	    var symbol = stockItem.Symbol;
	    console.log(symbol);
	    $scope.company = symbol;
	  };
	
	  $scope.trackInput = function () {
	    stockService.getStocks($scope.company).success(function (data) {
	      $scope.stockList = data;
	      console.log($scope.stockList);
	    });
	  };
	
	  tracked.read()
	  // $scope.getTracked = function() {
	  // tracked.get()
	  // .then(function(data) {
	  // console.log(data);
	  // })
	  .then(function (res) {
	    console.log('res:', res.data);
	    $scope.trackedStocks = res.data;
	  })['catch'](function (e) {
	    console.log('error', e);
	  });
	  // };
	
	  $scope.addTracked = function () {
	    tracked.add($scope.company).then(function (data) {
	      console.log('data', data.data);
	      $scope.trackedStocks = data.data;
	    });
	  };
	});
	
	stockApp.service("stockService", function ($http) {
	  this.getStocks = function (company) {
	    console.log("ok");
	    return $http.jsonp('http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=' + company + '&callback=JSON_CALLBACK');
	  };
	});
	
	stockApp.factory('tracked', function ($http) {
	  var tracked = function tracked() {};
	  tracked.read = function () {
	    return $http.get('http://localhost:3000/tracked');
	  };
	
	  tracked.add = function (symbol) {
	    console.log(symbol);
	    return $http.post('http://localhost:3000/tracked', { newSymbol: symbol });
	  };
	  return tracked;
	});

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map