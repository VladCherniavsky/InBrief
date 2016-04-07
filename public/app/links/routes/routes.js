(function () {
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        $stateProvider
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html',
                controller: 'LinksController',
                controllerAs: 'linksCtrl',
                resolve: {
                    resolvedLinks: getLinks
                }
            });

        function getLinks (linkService, Alertify) {
            return linkService
                .getLinks()
                .then(function (res) {
                    return res.data.links;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }

    }
} ());