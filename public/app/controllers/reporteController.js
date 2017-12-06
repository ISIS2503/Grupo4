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

	.controller('reporteFechaController', function(Reporte) {
		var vm = this;
		// variable to hide/show elements of the view
		vm.type = 'fecha';
		vm.fechaReporte = function() {
			// set a processing variable to show loading things
			vm.processing = true;
			vm.message = '';
			// get the user data for the user you want to edit
			// $routeParams is the way we grab data from the URL

			Reporte.fecha(vm.reporteData)
				.success(function(data) {
					// when all the users come back, remove the processing variable
					vm.processing = false;
					vm.reporteData = {};
					vm.reportes = data;
				});
		};
	});
