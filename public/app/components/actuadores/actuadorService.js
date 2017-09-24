angular.module('actuadorService', [])

.factory('Actuador', function($http) {

	// create a new object
	var actuadorFactory = {};

	// get a single user
	actuadorFactory.get = function(id) {
		return $http.get('/actuadores/' + id);
	};

	// get all users
	actuadorFactory.all = function() {
		return $http.get('/actuadeores/');
	};

	// create a user
	actuadorFactory.create = function(actuadorData) {
		return $http.post('/actuadoress/', actuadorData);
	};

	// update a user
	actuadorFactory.update = function(id, actuadorData) {
		return $http.put('/actuadores/' + id, actuadorData);
	};

	// delete a user
	actuadorFactory.delete = function(id) {
		return $http.delete('/actuadores/' + id);
	};

	// return our entire userFactory object
	return actuadorFactory;

});
