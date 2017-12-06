angular.module('ubicacionService', [])

	.factory('Ubicacion', function($http) {

		// create a new object
		var ubicacionFactory = {};

		// get a single ubicacion
		ubicacionFactory.get = function(id) {
			return $http.get('/devices/ubicaciones/' + id);
		};

		// get all ubicaciones
		ubicacionFactory.all = function() {
			return $http.get('/devices/ubicaciones/');
		};

		// create a ubicacion
		ubicacionFactory.create = function(ubicacionData) {
			return $http.post('/devices/ubicaciones/', ubicacionData);
		};

		// update a ubicacion
		ubicacionFactory.update = function(id, ubicacionData) {
			return $http.put('/devices/ubicaciones/' + id, ubicacionData);
		};

		// delete a ubicacion
		ubicacionFactory.delete = function(id) {
			return $http.delete('/devices/ubicaciones/' + id);
		};

		// return our entire ubicacionFactory object
		return ubicacionFactory;

	});
