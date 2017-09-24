angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})

		// show all niveles
		.when('/ubicacion/nivel', {
			templateUrl: 'app/views/pages/data/nivel.html',
			controller: 'ubicacionController',
			controllerAs: 'ubicacion'
		})
		//muestra un nivel
		.when('/ubicacion/nivel/:nivel_id', {
			templateUrl: 'app/views/pages/data/nivel.html',
			controller: 'ubicacionController',
			controllerAs: 'ubicacion'
		})
		// form to create a new user
		// same view as edit page
		// .when('/users/create', {
		// 	templateUrl: 'app/views/pages/users/single.html',
		// 	controller: 'userCreateController',
		// 	controllerAs: 'user'
		// })

		// page to edit a nivel
		.when('/ubicacion/nivel/:nivel_id', {
			templateUrl: 'app/views/pages/data/nivel.html',
			controller: 'ubicacionEditController',
			controllerAs: 'ubicacion'
		})
		//muestra todas las áreas
		.when('/ubicacion/nivel/:nivel_id/area', {
			templateUrl: 'app/views/pages/data/area.html',
			controller: 'ubicacionController',
			controllerAs: 'ubicacion'
		})
		//Muestra una área
		.when('/ubicacion/nivel/:nivel_id/area/:area_id', {
			templateUrl: 'app/views/pages/data/area.html',
			controller: 'ubicacionController',
			controllerAs: 'ubicacion'
		})
		//Muestra datos de un área especifica
		.when('/ubicacion/nivel/:nivel_id/area/:area_id/datos', {
			templateUrl: 'app/views/pages/data/datos.html',
			controller: 'sensorController',
			controllerAs: 'sensor'
		})
		//Muestra alertas generadas en un área especifica
		.when('/ubicacion/nivel/:nivel_id/area/:area_id/alertas', {
			templateUrl: 'app/views/pages/data/alertas.html',
			controller: 'alertaController',
			controllerAs: 'alerta'
		});

	$locationProvider.html5Mode(true);

});
