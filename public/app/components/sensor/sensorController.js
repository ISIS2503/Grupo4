angular.module('sensorCtrl', ['sensorService'])

.controller('sensorController', function(Sensor) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the sensors at page load
	Sensor.all()
		.success(function(data) {

			// when all the sensors come back, remove the processing variable
			vm.processing = false;

			// bind the sensors that come back to vm.sensors
			vm.sensors = data;
		});

	// function to delete a sensor
	vm.deleteSensor = function(id) {
		vm.processing = true;

		Sensor.delete(id)
			.success(function(data) {

				// get all sensors to update the table
				// you can also set up your api
				// to return the list of sensors with the delete call
				Sensor.all()
					.success(function(data) {
						vm.processing = false;
						vm.sensors = data;
					});

			});
	};

})

// controller applied to sensor creation page
.controller('sensorCreateController', function(Sensor) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a sensor
	vm.saveSensor = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the sensorService
		Sensor.create(vm.sensorData)
			.success(function(data) {
				vm.processing = false;
				vm.sensorData = {};
				vm.message = data.message;
			});

	};

})

// controller applied to sensor edit page
.controller('sensorEditController', function($routeParams, Sensor) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the sensor data for the sensor you want to edit
	// $routeParams is the way we grab data from the URL
	Sensor.get($routeParams.sensor_id)
		.success(function(data) {
			vm.sensorData = data;
		});

	// function to save the sensor
	vm.saveSensor = function() {
		vm.processing = true;
		vm.message = '';

		// call the sensorService function to update
		Sensor.update($routeParams.sensor_id, vm.sensorData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.sensorData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
