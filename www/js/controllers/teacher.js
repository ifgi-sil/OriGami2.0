(function () {
	'use strict';

	angular
		.module('starter')
		.controller('TeacherCtrl', TeacherController);

	TeacherController.$inject = ['API']

	function TeacherController (API) {
		var vm = this;
		vm.list = [];
		vm.error_msg = null;

		activate();

		////////////////////////////

		function activate () {
			API.getAll().success(function (data, status, headers, config) {
			    vm.list = [];
			    vm.error_msg = null;
			    for (var i = 0; i < data.length; i++) {
			        if (data[i].name != null) {
			            vm.list.push(data[i]);
			        }
			    }

			    if (vm.list.length == 0) {
			        vm.noData = true;
			    } else {
			        for (var i = 0; i < vm.list.length; i++) {
			            vm.list[i].diff = Array.apply(null, Array(vm.list[i].difficulty)).map(function () {
			                return "ion-ios-star"
			            });
			        }
			        vm.noData = false;
			    }
			}).error(function (data, status, headers, config) {
			    vm.error_msg = $translate.instant('network_error');
			});
		}
	}
})();