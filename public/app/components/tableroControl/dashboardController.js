angular.module('dashboardCtrl', ['dashboardService'])

.controller('dashboardController', function(Dashboard) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the dashboards at page load
	Dashboard.all()
		.success(function(data) {

			// when all the dashboards come back, remove the processing variable
			vm.processing = false;

			// bind the dashboards that come back to vm.dashboards
			vm.dashboards = data;
		});

	// function to delete a dashboard
	vm.deleteDashboard = function(id) {
		vm.processing = true;

		Dashboard.delete(id)
			.success(function(data) {

				// get all dashboards to update the table
				// you can also set up your api
				// to return the list of dashboards with the delete call
				Dashboard.all()
					.success(function(data) {
						vm.processing = false;
						vm.dashboards = data;
					});

			});
	};

})

// controller applied to dashboard creation page
.controller('dashboardCreateController', function(Dashboard) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a dashboard
	vm.saveDashboard = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the dashboardService
		Dashboard.create(vm.dashboardData)
			.success(function(data) {
				vm.processing = false;
				vm.dashboardData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to dashboard edit page
.controller('dashboardEditController', function($routeParams, Dashboard) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the dashboard data for the dashboard you want to edit
	// $routeParams is the way we grab data from the URL
	Dashboard.get($routeParams.dashboard_id)
		.success(function(data) {
			vm.dashboardData = data;
		});

	// function to save the dashboard
	vm.saveDashboard = function() {
		vm.processing = true;
		vm.message = '';

		// call the dashboardService function to update
		Dashboard.update($routeParams.dashboard_id, vm.dashboardData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.dashboardData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
