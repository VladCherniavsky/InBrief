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
            })
            .state('tag', {
                url: '/tag/:tag',
                templateUrl: 'links/views/linksByTag.html',
                controller: 'LinksByTagController',
                controllerAs: 'linksByTag',
                resolve: {
                    resolvedByTag: getLinkByTag
                }
            });

        function getLinks (linkService, Alertify, commonService) {
            return linkService
                .getLinks(commonService.getPaginationSet())
                .then(function (res) {
                    return {
                        links: commonService.checkEdit(res.data.links),
                        count: res.data.count
                    };
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }
        function getLinkByTag ($stateParams, commonService, Alertify, linkService) {
            return linkService
                .getLinkByTag($stateParams.tag, commonService.getPaginationSet())
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