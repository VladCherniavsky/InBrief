(function() {
    angular
        .module('InBrief', [
            'ui.router',
            'Alertify',
            'ui.bootstrap',
            'ngCookies'
        ])
        .config(config)
        .run(runBlock);

    function config ($httpProvider) {
        $httpProvider.interceptors.push('authIntercepor');
    }
    function runBlock ($rootScope, $cookies, authService) {
        $rootScope.logged = false;
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        authService.defaultRequest();

        function loggedProcess () {
            $rootScope.logged = true;
        }

        function logoutProcess () {
            angular.forEach($cookies.getAll(), function (v, k) {
                $cookies.remove(k);
            });
            $rootScope.logged = false;
        }
    }
}());