(function () {
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        console.log('$stateProvider', $stateProvider);
        $stateProvider
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html',
                controller: 'LinksController',
                controllerAs: 'linksCtrl',
                resolve: {
                    resolvedLinks: getLinks
                }
            })
            .state('details', {
                url: '/details',
                templateUrl: 'links/views/linkDetails.html',
                controller: 'LinkDetailsController',
                controllerAs: 'linkDetails'
            });

        function getLinks (linkService, Alertify) {
            return linkService
                .getLinks()
                .then(function (res) {
                    return {
                        links: res.data.links,
                        count: res.data.count
                    };
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }

    }
} ());