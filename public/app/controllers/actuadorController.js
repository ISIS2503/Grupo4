angular.module('actuadorCtrl', ['actuadorService'])

	.controller('actuadorController', function(Actuador) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;

		// grab all the actuadores at page load
		Actuador.all()
			.success(function(data) {

				// when all the actuadores come back, remove the processing variable
				vm.processing = false;

				// bind the actuadores that come back to vm.actuadores
				vm.actuadores = data;
			});

		// function to delete a actuador
		vm.deleteActuador = function(id) {
			vm.processing = true;

			Actuador.delete(id)
				.success(function(data) {

					// get all actuadores to update the table
					// you can also set up your api
					// to return the list of actuadores with the delete call
					Actuador.all()
						.success(function(data) {
							vm.processing = false;
							vm.actuadores = data;
						});

				});
		};

	});
