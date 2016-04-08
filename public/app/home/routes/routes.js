(function () {
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/views/main.html',
                controller: 'HomeController',
                controllerAs: 'home',
                resolve: {
                    resolvedUserLinks: getUserLinks
                }
            });

        function getUserLinks (linkService, Alertify, $rootScope) {
            return linkService
                .getUserLinks()
                .then(function (res) {
                    $rootScope.showMyLinks = true;
                    console.log('res.data.links', res.data);
                    return res.data;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }
    }
} ());