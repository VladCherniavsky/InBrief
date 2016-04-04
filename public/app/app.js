(function() {
    angular.module('InBrief', [])
        .controller('Main', MainController);

    function MainController ($scope, hello, $timeout) {
        $scope.vlad = hello.getString();
        $timeout(function () {
            console.log(hello.getString());
        }, 0);
    }

}());