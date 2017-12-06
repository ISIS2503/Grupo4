angular.module('app.routes', ['ngRoute'])

	.config(function($routeProvider, $locationProvider) {

		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl: 'app/views/pages/home.html',
				controller: 'mainController',
				controllerAs: 'login'
			})

			.when('/users', {
				templateUrl: 'app/views/pages/users/me.html'
			})

			// show all users
			.when('/users/:user_id', {
				templateUrl: 'app/views/pages/users/edit.html',
				controller: 'userEditController',
				controllerAs: 'user'
			})

			.when('/alertas', {
				templateUrl: 'app/views/pages/alertas/alertas.html',
				controller: 'alertaController',
				controllerAs: 'alerta'
			})

			.when('/alertas/tipo', {
				templateUrl: 'app/views/pages/alertas/alertas.html',
				controller: 'alertaTipoController',
				controllerAs: 'alerta'
			})

			.when('/alertas/fecha', {
				templateUrl: 'app/views/pages/alertas/alertas.html',
				controller: 'alertaFechaController',
				controllerAs: 'alerta'
			})

			.when('/alertas/device', {
				templateUrl: 'app/views/pages/alertas/alertas.html',
				controller: 'alertaDeviceController',
				controllerAs: 'alerta'
			})

			.when('/reportes', {
				templateUrl: 'app/views/pages/reportes/reportes.html',
				controller: 'reporteController',
				controllerAs: 'reporte'
			})

			.when('/reportes/fecha', {
				templateUrl: 'app/views/pages/reportes/reportes.html',
				controller: 'reporteFechaController',
				controllerAs: 'reporte'
			})

			.when('/ubicaciones', {
				templateUrl: 'app/views/pages/devices/ubicaciones.html',
				controller: 'ubicacionController',
				controllerAs: 'ubicacion'
			})

			.when('/actuadores', {
				templateUrl: 'app/views/pages/devices/actuadores.html',
				controller: 'actuadorController',
				controllerAs: 'actuador'
			})

			.when('/micros', {
				templateUrl: 'app/views/pages/devices/micros.html',
				controller: 'microController',
				controllerAs: 'micro'
			})

			.when('/sensores', {
				templateUrl: 'app/views/pages/devices/sensores.html',
				controller: 'sensorController',
				controllerAs: 'sensor'
			})

			.when('/historico/fecha', {
				templateUrl: 'app/views/pages/dashboard/dashboard.html',
				controller: 'dashboardFechaController',
				controllerAs: 'dashboard'
			})

			.when('/historico/device', {
				templateUrl: 'app/views/pages/dashboard/dashboard.html',
				controller: 'dashboardDeviceController',
				controllerAs: 'dashboard'
			});

		$locationProvider.html5Mode(true);

	});
