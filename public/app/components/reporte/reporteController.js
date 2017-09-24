angular.module('reporteCtrl', ['reporteService'])

.controller('reporteController', function(Reporte) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the reportes at page load
	Reporte.all()
		.success(function(data) {

			// when all the reportes come back, remove the processing variable
			vm.processing = false;

			// bind the reportes that come back to vm.reportes
			vm.reportes = data;
		});

	// function to delete a reporte
	vm.deleteReporte = function(id) {
		vm.processing = true;

		Reporte.delete(id)
			.success(function(data) {

				// get all reportes to update the table
				// you can also set up your api
				// to return the list of reportes with the delete call
				Reporte.all()
					.success(function(data) {
						vm.processing = false;
						vm.reportes = data;
					});

			});
	};

})

// controller applied to reporte creation page
.controller('reporteCreateController', function(Reporte) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a reporte
	vm.saveReporte = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the reporteService
		Reporte.create(vm.reporteData)
			.success(function(data) {
				vm.processing = false;
				vm.reporteData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to reporte edit page
.controller('reporteEditController', function($routeParams, Reporte) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the reporte data for the reporte you want to edit
	// $routeParams is the way we grab data from the URL
	Reporte.get($routeParams.reporte_id)
		.success(function(data) {
			vm.reporteData = data;
		});

	// function to save the reporte
	vm.saveReporte = function() {
		vm.processing = true;
		vm.message = '';

		// call the reporteService function to update
		Reporte.update($routeParams.reporte_id, vm.reporteData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.reporteData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
