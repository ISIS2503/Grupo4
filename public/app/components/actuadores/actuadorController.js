angular.module('actuadorControlador', ['actuadorService'])

.controller('actuadorController', function(Actuador) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	Actuador.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.actuadores = data;
		});

	// function to delete a user
	vm.deleteActuador = function(id) {
		vm.processing = true;

		Actuador.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				Actuador.all()
					.success(function(data) {
						vm.processing = false;
						vm.actuadores = data;
					});

			});
	};

})

// controller applied to user creation page
.controller('actuadorCreateController', function(Actuador) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveActuador = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the userService
		Actuador.create(vm.actuadorData)
			.success(function(data) {
				vm.processing = false;
				vm.actuadorData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to user edit page
.controller('actuadorEditController', function($routeParams, Actuador) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	Actuador.get($routeParams.actuador_id)
		.success(function(data) {
			vm.actuadorData = data;
		});

	// function to save the user
	vm.saveActuador = function() {
		vm.processing = true;
		vm.message = '';

		// call the userService function to update
		Actuador.update($routeParams.actuador_id, vm.actuadorData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.actuadorData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
