(function () {
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController ($rootScope, $timeout) {
        var self = this;

        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        function loggedProcess () {
            console.log('$rootScope.logged', $rootScope.logged);
            $timeout(function () {
                self.logged = true;
            }, 0);
        }
        function logoutProcess () {
            $timeout(function () {
                self.logged = false;
                $rootScope.logged = false;
            }, 0);
        }
    }
}());