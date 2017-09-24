angular.module('reporteService', [])

.factory('Reporte', function($http) {

	// create a new object
	var reporteFactory = {};

	// get a single reporte
	reporteFactory.get = function(id) {
		return $http.get('/reportes/' + id);
	};

	// get all reportes
	reporteFactory.all = function() {
		return $http.get('/reportes/');
	};

	// create a reporte
	reporteFactory.create = function(reporteData) {
		return $http.post('/reportes/', reporteData);
	};

	// update a reporte
	reporteFactory.update = function(id, reporteData) {
		return $http.put('/reportes/' + id, reporteData);
	};

	// delete a reporte
	reporteFactory.delete = function(id) {
		return $http.delete('/reportes/' + id);
	};

	// return our entire reporteFactory object
	return reporteFactory;

});
