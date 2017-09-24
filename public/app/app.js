angular.module('app', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService', 'actuadorControlador', 'actuadorService', 'alertaCtrl', 'alertaService', 'microCtrl', 'microService', 'reporteCtrl', 'reporteService', 'sensorCtrl', 'sensorService', 'dashboardCtrl', 'dashboardService',
'ubicacionCtrl', 'ubicacionService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
