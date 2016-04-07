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

        function getUserLinks (linkService, Alertify) {
            return linkService
                .getUserLinks()
                .then(function (res) {
                    console.log('res.data.links', res.data.links);
                    return res.data.links;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }
    }
} ());