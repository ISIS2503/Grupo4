angular.module('dashboardCtrl', ['dashboardService', 'ui.bootstrap'])

	.controller('dashboardController', function(Dashboard) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;
		vm.pageSize = 10;
		vm.currentPage = 1;

		// grab all the users at page load
		Dashboard.all()
			.success(function(data) {

				// when all the users come back, remove the processing variable
				vm.processing = false;

				// bind the users that come back to vm.users
				vm.dashboards = data;
			});

		// function to delete a user
		vm.deleteDashboard = function(id) {
			vm.processing = true;

			Dashboard.delete(id)
				.success(function(data) {

					// get all users to update the table
					// you can also set up your api
					// to return the list of users with the delete call
					Dashboard.all()
						.success(function(data) {
							vm.processing = false;
							vm.dashboards = data;
						});

				});
		};

	})

	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	})

	.controller('dashboardTipoController', function(Dashboard) {
		var vm = this;
		vm.pageSize = 10;
		vm.currentPage = 1;
		// variable to hide/show elements of the view
		vm.type = 'tipo';
		vm.tipoDashboard = function() {
			// set a processing variable to show loading things
			vm.processing = true;
			// get the user data for the user you want to edit
			// $routeParams is the way we grab data from the URL
			Dashboard.tipo(vm.dashboardData)
				.success(function(data) {
					// when all the users come back, remove the processing variable
					vm.processing = false;
					vm.dashboardData = {};
					vm.dashboards = data;
				});
		};
	})

	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	})

	.controller('dashboardDeviceController', function(Dashboard) {
		var vm = this;
		vm.pageSize = 10;
		vm.currentPage = 1;
		// variable to hide/show elements of the view
		vm.type = 'device';
		vm.deviceDashboard = function() {
			// set a processing variable to show loading things
			vm.processing = true;
			vm.message = '';
			// get the user data for the user you want to edit
			// $routeParams is the way we grab data from the URL

			Dashboard.device(vm.dashboardData)
				.success(function(data) {
					// when all the users come back, remove the processing variable
					vm.processing = false;
					vm.dashboardData = {};
					vm.dashboards = data;
				});
		};
	})

	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	})

	.controller('dashboardFechaController', function(Dashboard) {
		var vm = this;
		vm.pageSize = 10;
		vm.currentPage = 1;
		// variable to hide/show elements of the view
		vm.type = 'fecha';
		vm.fechaDashboard = function() {
			// set a processing variable to show loading things
			vm.processing = true;
			vm.message = '';
			// get the user data for the user you want to edit
			// $routeParams is the way we grab data from the URL

			Dashboard.fecha(vm.dashboardData)
				.success(function(data) {
					// when all the users come back, remove the processing variable
					vm.processing = false;
					vm.dashboardData = {};
					vm.dashboards = data;
				});
		};
	})

	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	});
