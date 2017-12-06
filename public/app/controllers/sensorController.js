angular.module('sensorCtrl', ['sensorService'])

	.controller('sensorController', function(Sensor) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;

		// grab all the sensores at page load
		Sensor.all()
			.success(function(data) {

				// when all the sensores come back, remove the processing variable
				vm.processing = false;

				// bind the sensores that come back to vm.sensores
				vm.sensores = data;
			});

		// function to delete a sensor
		vm.deleteSensor = function(id) {
			vm.processing = true;

			Sensor.delete(id)
				.success(function(data) {

					// get all sensores to update the table
					// you can also set up your api
					// to return the list of sensores with the delete call
					Sensor.all()
						.success(function(data) {
							vm.processing = false;
							vm.sensores = data;
						});

				});
		};

	});
