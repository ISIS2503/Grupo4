angular.module('ubicacionCtrl', ['ubicacionService'])

	.controller('ubicacionController', function(Ubicacion) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;

		// grab all the ubicaciones at page load
		Ubicacion.all()
			.success(function(data) {

				// when all the ubicaciones come back, remove the processing variable
				vm.processing = false;

				// bind the ubicaciones that come back to vm.ubicaciones
				vm.ubicaciones = data;
			});

		// function to delete a ubicacion
		vm.deleteUbicacion = function(id) {
			vm.processing = true;

			Ubicacion.delete(id)
				.success(function(data) {

					// get all ubicaciones to update the table
					// you can also set up your api
					// to return the list of ubicaciones with the delete call
					Ubicacion.all()
						.success(function(data) {
							vm.processing = false;
							vm.ubicaciones = data;
						});

				});
		};

	});
