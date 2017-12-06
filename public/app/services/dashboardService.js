angular.module('dashboardService', [])

	.factory('Dashboard', function($http) {

		// create a new object
		var dashboardFactory = {};

		dashboardFactory.fecha = function(dashboardData) {
			return $http.post('/dashboard/device/', dashboardData);
		};

		dashboardFactory.device = function(dashboardData) {
			return $http.post('/dashboard/device/', dashboardData);
		};

		// return our entire dashboardFactory object
		return dashboardFactory;

	});
