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
    function runBlock ($rootScope) {
        $rootScope.logged = false;
        console.log('run');
        $rootScope.$on('logged', loggedProcess);

        function loggedProcess () {
            $rootScope.logged = true;
        }
    }
}());