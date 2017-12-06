angular.module('alertaService', [])

	.factory('Alerta', function($http) {

		// create a new object
		var alertaFactory = {};

		// get a single alerta
		alertaFactory.get = function(id) {
			return $http.get('/dashboard/alertas/' + id);
		};

		// get a single alerta
		alertaFactory.tipo = function(alertaData) {
			return $http.post('/dashboard/alertas/tipo/', alertaData);
		};

		alertaFactory.fecha = function(alertaData) {
			return $http.post('/dashboard/alertas/fecha/', alertaData);
		};

		alertaFactory.device = function(alertaData) {
			return $http.post('/dashboard/alertas/device/', alertaData);
		};

		// get all alertas
		alertaFactory.all = function() {
			return $http.get('/dashboard/alertas/');
		};

		// delete a alerta
		alertaFactory.delete = function(id) {
			return $http.delete('/dashboard/alertas/' + id);
		};

		// return our entire alertaFactory object
		return alertaFactory;

	});
