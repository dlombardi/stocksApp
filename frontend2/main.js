'use strict';

var app = angular.module('stockTest', []);

app.controller('testCtrl', function($scope,tracked) {
	tracked.read()
	// $scope.getTracked = function() {
		// tracked.get()
		// .then(function(data) {
			// console.log(data);
		// })
	.then(function(res) {
		console.log('res:', res.data);
		$scope.trackedStocks = res.data;
	})
		.catch(function(e) {
			console.log('error', e)
		})
	// };

	$scope.addTracked = function() {
		tracked.add($scope.newSymbol)
		.then(function(data) {
			console.log('data', data.data);
			$scope.trackedStocks = data.data;
		})
	}
});

// app.constant('apiUrl', "http://localhost:3000/tracked")

app.factory('tracked', function($http) {
	var tracked = function() {};
		tracked.read = function() {
			return $http.get('http://localhost:3000/tracked')
		};
		
		tracked.add =function(symbol) {
			return $http.post('http://localhost:3000/tracked', {newSymbol: symbol})
		}
	return tracked;
});