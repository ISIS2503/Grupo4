angular.module('app', [
		'ngAnimate',
		'app.routes',
		'authService',
		'mainCtrl',
		'userCtrl',
		'userService',
		'actuadorCtrl',
		'actuadorService',
		'sensorCtrl',
		'sensorService',
		'ubicacionCtrl',
		'ubicacionService',
		'alertaCtrl',
		'alertaService',
		'reporteCtrl',
		'reporteService',
		'microCtrl',
		'microService'
	])

	// application configuration to integrate token into requests
	.config(function($httpProvider) {

		// attach our auth interceptor to the http requests
		$httpProvider.interceptors.push('AuthInterceptor');

	});
