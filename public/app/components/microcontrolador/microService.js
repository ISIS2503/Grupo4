angular.module('microService', [])

.factory('micro', function($http) {

	// create a new object
	var microFactory = {};

	// get a single micro
	microFactory.get = function(id) {
		return $http.get('/micros/' + id);
	};

	// get all micros
	microFactory.all = function() {
		return $http.get('/micros/');
	};

	// create a micro
	microFactory.create = function(microData) {
		return $http.post('/micros/', microData);
	};

	// update a micro
	microFactory.update = function(id, microData) {
		return $http.put('/micros/' + id, microData);
	};

	// delete a micro
	microFactory.delete = function(id) {
		return $http.delete('/micros/' + id);
	};

	// return our entire microFactory object
	return microFactory;

});
