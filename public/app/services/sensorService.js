angular.module('sensorService', [])

	.factory('Sensor', function($http) {

		// create a new object
		var sensorFactory = {};

		// get a single sensor
		sensorFactory.get = function(id) {
			return $http.get('/devices/sensores/' + id);
		};

		// get all sensores
		sensorFactory.all = function() {
			return $http.get('/devices/sensores/');
		};

		// create a sensor
		sensorFactory.create = function(sensorData) {
			return $http.post('/devices/sensores/', sensorData);
		};

		// update a sensor
		sensorFactory.update = function(id, sensorData) {
			return $http.put('/devices/sensores/' + id, sensorData);
		};

		// delete a sensor
		sensorFactory.delete = function(id) {
			return $http.delete('/devices/sensores/' + id);
		};

		// return our entire sensorFactory object
		return sensorFactory;

	});
