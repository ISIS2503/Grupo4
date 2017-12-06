angular.module('reporteService', [])

	.factory('Reporte', function($http) {

		// create a new object
		var reporteFactory = {};

		// get a single reporte
		reporteFactory.get = function(id) {
			return $http.get('/dashboard/reportes/' + id);
		};

		// get all reportes
		reporteFactory.all = function() {
			return $http.get('/dashboard/reportes/');
		};

		reporteFactory.fecha = function(reporteData) {
			return $http.post('/dashboard/reportes/fecha/', reporteData);
		};

		// create a reporte
		reporteFactory.create = function(reporteData) {
			return $http.post('/dashboard/reportes/', reporteData);
		};

		// return our entire reporteFactory object
		return reporteFactory;

	});
