angular.module('dashboardService', [])

.factory('Dashboard', function($http) {

	// create a new object
	var dashboardFactory = {};

	// get a single dashboard
	dashboardFactory.get = function(id) {
		return $http.get('/dashboards/' + id);
	};

	// get all dashboards
	dashboardFactory.all = function() {
		return $http.get('/dashboards/');
	};

	// create a dashboard
	dashboardFactory.create = function(dashboardData) {
		return $http.post('/dashboards/', dashboardData);
	};

	// update a dashboard
	dashboardFactory.update = function(id, dashboardData) {
		return $http.put('/dashboards/' + id, dashboardData);
	};

	// delete a dashboard
	dashboardFactory.delete = function(id) {
		return $http.delete('/dashboards/' + id);
	};

	// return our entire dashboardFactory object
	return dashboardFactory;

});
