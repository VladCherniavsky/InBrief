(function() {
    angular
        .module('InBrief', [
            'ui.router',
            'ui.bootstrap'
        ])
        .controller('Main', MainController);

    function MainController ($scope) {
        $scope.vlad = 'sss';
    }
}());