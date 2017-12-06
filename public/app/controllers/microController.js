angular.module('microCtrl', ['microService', 'ui.bootstrap'])

	.controller('microController', function(Micro) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;
		vm.currentPage = 1;
		vm.pageSize = 5;

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

	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	});
