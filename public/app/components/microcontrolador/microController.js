angular.module('microCtrl', ['microService'])

.controller('micro', function(Micro) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the micros at page load
	Micro.all()
		.success(function(data) {

			// when all the micros come back, remove the processing variable
			vm.processing = false;

			// bind the micros that come back to vm.micros
			vm.micros = data;
		});

	// function to delete a micro
	vm.deleteMicro = function(id) {
		vm.processing = true;

		Micro.delete(id)
			.success(function(data) {

				// get all micros to update the table
				// you can also set up your api
				// to return the list of micros with the delete call
				Micro.all()
					.success(function(data) {
						vm.processing = false;
						vm.micros = data;
					});

			});
	};

})

// controller applied to micro creation page
.controller('microCreateController', function(Micro) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a micro
	vm.saveMicro = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the microService
		Micro.create(vm.microData)
			.success(function(data) {
				vm.processing = false;
				vm.microData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to micro edit page
.controller('microEditController', function($routeParams, Micro) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the micro data for the micro you want to edit
	// $routeParams is the way we grab data from the URL
	Micro.get($routeParams.micro_id)
		.success(function(data) {
			vm.microData = data;
		});

	// function to save the micro
	vm.saveMicro = function() {
		vm.processing = true;
		vm.message = '';

		// call the microService function to update
		Micro.update($routeParams.micro_id, vm.microData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.microData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
