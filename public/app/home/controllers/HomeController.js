(function () {
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController ($rootScope, $timeout) {
        var self = this;

        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);
        
        self.logged = $rootScope.logged;

        function loggedProcess () {
            self.logged = true;
        }
        
        function logoutProcess () {
            self.logged = false;
            $rootScope.logged = false;
        }
    }
}());