(function () {
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'home/views/main.html',
                controller: 'HomeController',
                controllerAs: 'home'
            });
    }
} ());