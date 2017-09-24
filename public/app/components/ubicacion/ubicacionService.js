angular.module('ubicacionService', [])

.factory('Ubicacion', function($http) {

	// create a new object
	var ubicacionFactory = {};

	// get a single ubicacion
	ubicacionFactory.get = function(id) {
		return $http.get('/ubicaciones/' + id);
	};

	// get all ubicaciones
	ubicacionFactory.all = function() {
		return $http.get('/ubicaciones/');
	};

	// create a ubicacion
	ubicacionFactory.create = function(ubicacionData) {
		return $http.post('/ubicaciones/', ubicacionData);
	};

	// update a ubicacion
	ubicacionFactory.update = function(id, ubicacionData) {
		return $http.put('/ubicaciones/' + id, ubicacionData);
	};

	// delete a ubicacion
	ubicacionFactory.delete = function(id) {
		return $http.delete('/ubicaciones/' + id);
	};

	// return our entire ubicacionFactory object
	return ubicacionFactory;

});
