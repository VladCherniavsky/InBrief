(function() {
    angular
        .module('InBrief', [
            'ui.router'
        ])
        .controller('Main', MainController);

    function MainController ($scope) {
        $scope.vlad = 'sss';
    }

}());