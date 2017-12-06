angular.module('actuadorService', [])

	.factory('Actuador', function($http) {

		// create a new object
		var actuadorFactory = {};

		// get a single actuador
		actuadorFactory.get = function(id) {
			return $http.get('/devices/actuadores/' + id);
		};

		// get all actuadores
		actuadorFactory.all = function() {
			return $http.get('/devices/actuadores/');
		};

		// create a actuador
		actuadorFactory.create = function(actuadorData) {
			return $http.post('/devices/actuadores/', actuadorData);
		};

		// update a actuador
		actuadorFactory.update = function(id, actuadorData) {
			return $http.put('/devices/actuadores/' + id, actuadorData);
		};

		// delete a actuador
		actuadorFactory.delete = function(id) {
			return $http.delete('/devices/actuadores/' + id);
		};

		// return our entire actuadorFactory object
		return actuadorFactory;

	});
