(function() {
    'use strict';
    angular
        .module('InBrief')
        .directive('loginForm', loginForm);

    function loginForm() {
        return {
            restrict: 'E',
            templateUrl: 'common/auth/tmpl/login-form-tmpl.html',
            controller: 'LoginFormController',
            controllerAs: 'loginForm',
            bindToController: {
                close: '&',
                button: '=',
                submit: '&'
            }
        };
    }
}());
