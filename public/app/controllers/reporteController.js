angular.module('reporteCtrl', ['reporteService', 'ui.bootstrap'])

	.controller('reporteController', function(Reporte) {

		var vm = this;
		vm.pageSize = 10;
		vm.currentPage = 1;
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


	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	})

	.controller('reporteFechaController', function(Reporte) {
		var vm = this;
		vm.pageSize = 10;
		vm.currentPage = 1;
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
	})


	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	});
