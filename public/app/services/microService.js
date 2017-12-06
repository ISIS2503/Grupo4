angular.module('microService', [])

	.factory('Micro', function($http) {

		// create a new object
		var microFactory = {};

		// get a single micro
		microFactory.get = function(id) {
			return $http.get('/devices/micros/' + id);
		};

		// get all micros
		microFactory.all = function() {
			return $http.get('/devices/micros/');
		};

		// create a micro
		microFactory.create = function(microData) {
			return $http.post('/devices/micros/', microData);
		};

		// update a micro
		microFactory.update = function(id, microData) {
			return $http.put('/devices/micros/' + id, microData);
		};

		// delete a micro
		microFactory.delete = function(id) {
			return $http.delete('/devices/micros/' + id);
		};

		// return our entire microFactory object
		return microFactory;

	});
