(function () {
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'links/views/main.html'
            })
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html'
            });

    }
} ());