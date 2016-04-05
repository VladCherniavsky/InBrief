(function() {
    angular
        .module('InBrief', [
            'ui.router',
            'Alertify',
            'ui.bootstrap'
        ])
        .controller('Main', MainController);

    function MainController ($scope) {
        $scope.vlad = 'sss';
    }
}());