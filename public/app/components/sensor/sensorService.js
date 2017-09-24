angular.module('sensorService', [])

.factory('Sensor', function($http) {

	// create a new object
	var sensorFactory = {};

	// get a single sensor
	sensorFactory.get = function(id) {
		return $http.get('/sensors/' + id);
	};

	// get all sensors
	sensorFactory.all = function() {
		return $http.get('/sensors/');
	};

	// create a sensor
	sensorFactory.create = function(sensorData) {
		return $http.post('/sensors/', sensorData);
	};

	// update a sensor
	sensorFactory.update = function(id, sensorData) {
		return $http.put('/sensors/' + id, sensorData);
	};

	// delete a sensor
	sensorFactory.delete = function(id) {
		return $http.delete('/sensors/' + id);
	};

	// return our entire sensorFactory object
	return sensorFactory;

});
