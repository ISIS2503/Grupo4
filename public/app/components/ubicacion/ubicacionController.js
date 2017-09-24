angular.module('ubicacionCtrl', ['ubicacionService'])

.controller('ubicacionController', function(Ubicacion) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the ubicacions at page load
	Ubicacion.all()
		.success(function(data) {

			// when all the ubicacions come back, remove the processing variable
			vm.processing = false;

			// bind the ubicacions that come back to vm.ubicacions
			vm.ubicacions = data;
		});

	// function to delete a ubicacion
	vm.deleteUbicacion = function(id) {
		vm.processing = true;

		Ubicacion.delete(id)
			.success(function(data) {

				// get all ubicacions to update the table
				// you can also set up your api
				// to return the list of ubicacions with the delete call
				Ubicacion.all()
					.success(function(data) {
						vm.processing = false;
						vm.ubicacions = data;
					});

			});
	};

})

// controller applied to ubicacion creation page
.controller('ubicacionCreateController', function(Ubicacion) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a ubicacion
	vm.saveUbicacion = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the ubicacionService
		Ubicacion.create(vm.ubicacionData)
			.success(function(data) {
				vm.processing = false;
				vm.ubicacionData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to ubicacion edit page
.controller('ubicacionEditController', function($routeParams, Ubicacion) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the ubicacion data for the ubicacion you want to edit
	// $routeParams is the way we grab data from the URL
	Ubicacion.get($routeParams.ubicacion_id)
		.success(function(data) {
			vm.ubicacionData = data;
		});

	// function to save the ubicacion
	vm.saveUbicacion = function() {
		vm.processing = true;
		vm.message = '';

		// call the ubicacionService function to update
		Ubicacion.update($routeParams.ubicacion_id, vm.ubicacionData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.ubicacionData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
