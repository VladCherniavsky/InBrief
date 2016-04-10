(function() {
    angular
        .module('InBrief', [
            'ui.router',
            'Alertify',
            'ui.bootstrap',
            'ngCookies',
            'ngMessages'
        ])
        .config(config)
        .run(runBlock);

    function config ($httpProvider) {
        $httpProvider.interceptors.push('authIntercepor');
    }
    function runBlock ($rootScope, $window, authService, commonService) {
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);
        $rootScope.host = commonService.getHost();

        if ($window.localStorage.token) {
            authService.defaultRequest();
            $rootScope.canLogin = true;
        }
        function loggedProcess () {
            $rootScope.logged = true;
        }

        function logoutProcess () {
            $window.localStorage.clear();;
            $rootScope.logged = false;
            $rootScope.canLogin = false;

        }
    }
}());