angular.module('alertaService', [])

.factory('Alerta', function($http) {

	// create a new object
	var alertaFactory = {};

	// get a single alerta
	alertaFactory.get = function(id) {
		return $http.get('/alertas/' + id);
	};

	// get all alertas
	alertaFactory.all = function() {
		return $http.get('/alertas/');
	};

	// create a alerta
	alertaFactory.create = function(alertaData) {
		return $http.post('/alertas/', alertaData);
	};

	// update a alerta
	alertaFactory.update = function(id, alertaData) {
		return $http.put('/alertas/' + id, alertaData);
	};

	// delete a alerta
	alertaFactory.delete = function(id) {
		return $http.delete('/alertas/' + id);
	};

	// return our entire alertaFactory object
	return alertaFactory;

});
