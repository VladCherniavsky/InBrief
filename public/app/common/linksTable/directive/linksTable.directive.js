(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('linksTable', linksTable);

    function linksTable () {
        return {
            restrict: 'E',
            templateUrl: 'common/linksTable/template/linksTable-tmpl.html',
            controller: 'LinksTableController',
            controllerAs: 'linksTableCtrl',
            bindToController: {
                links: '=',
                details: '&',
                title: '='
            }
        };
    }
}());