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

        function getUserLinks (linkService, Alertify, commonService, $rootScope) {
            if ($rootScope.logged) {
                return linkService
                .getUserLinks(commonService.getPaginationSet())
                .then(function (res) {
                    commonService.checkEdit(res.data.links);
                    return res.data;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
            }
            
        }
    }
} ());