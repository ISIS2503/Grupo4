angular.module('alertaCtrl', ['alertaService'])

	.controller('alertaController', function(Alerta) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;

		// grab all the users at page load
		Alerta.all()
			.success(function(data) {

				// when all the users come back, remove the processing variable
				vm.processing = false;

				// bind the users that come back to vm.users
				vm.alertas = data;
			});

		// function to delete a user
		vm.deleteAlerta = function(id) {
			vm.processing = true;

			Alerta.delete(id)
				.success(function(data) {

					// get all users to update the table
					// you can also set up your api
					// to return the list of users with the delete call
					Alerta.all()
						.success(function(data) {
							vm.processing = false;
							vm.alertas = data;
						});

				});
		};

	})

	.controller('alertaEditController', function($routeParams, Alerta) {

		var vm = this;

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'edit';

		// get the user data for the user you want to edit
		// $routeParams is the way we grab data from the URL
		Alerta.get($routeParams.alerta_id)
			.success(function(data) {
				vm.alertaData = data;
			});

		// function to save the user
		vm.saveAlerta = function() {
			vm.processing = true;
			vm.message = '';

			// call the userService function to update
			Alerta.update($routeParams.Alerta_id, vm.alertaData)
				.success(function(data) {
					vm.processing = false;

					// clear the form
					vm.alertaData = {};

					// bind the message from our API to vm.message
					vm.message = data.message;
				});
		};

	})

	.controller('alertaTipoController', function(Alerta) {
		var vm = this;
		// variable to hide/show elements of the view
		vm.type = 'tipo';
		vm.tipoAlerta = function() {
			// set a processing variable to show loading things
			vm.processing = true;
			// get the user data for the user you want to edit
			// $routeParams is the way we grab data from the URL
			Alerta.tipo(vm.alertaData)
				.success(function(data) {
					// when all the users come back, remove the processing variable
					vm.processing = false;
					vm.alertaData = {};
					vm.alertas = data;
				});
		};
	})

	.controller('alertaDeviceController', function(Alerta) {
		var vm = this;
		// variable to hide/show elements of the view
		vm.type = 'device';
		vm.deviceAlerta = function() {
			// set a processing variable to show loading things
			vm.processing = true;
			vm.message = '';
			// get the user data for the user you want to edit
			// $routeParams is the way we grab data from the URL

			Alerta.device(vm.alertaData)
				.success(function(data) {
					// when all the users come back, remove the processing variable
					vm.processing = false;
					vm.alertaData = {};
					vm.alertas = data;
				});
		};
	})

	.controller('alertaFechaController', function(Alerta) {
		var vm = this;
		// variable to hide/show elements of the view
		vm.type = 'fecha';
		vm.fechaAlerta = function() {
			// set a processing variable to show loading things
			vm.processing = true;
			vm.message = '';
			// get the user data for the user you want to edit
			// $routeParams is the way we grab data from the URL

			Alerta.fecha(vm.alertaData)
				.success(function(data) {
					// when all the users come back, remove the processing variable
					vm.processing = false;
					vm.alertaData = {};
					vm.alertas = data;
				});
		};
	});
