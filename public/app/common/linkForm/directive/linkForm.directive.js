(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('linkForm', linkForm);

    function linkForm () {
        return {
            restrict: 'E',
            templateUrl: 'common/linkForm/template/linkForm-tmpl.html',
            controller: 'LinkFormController',
            controllerAs: 'linkFormCtrl',
            bindToController: {
                action: '&',
                link: '='

            }
        };
    }
}());