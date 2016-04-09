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
            })
            .state('edit', {
                url: '/edit/:linkId',
                templateUrl: 'links/views/editLink.html',
                controller: 'EditLinkController',
                controllerAs: 'editLink',
                resolve: {
                    resolvedLink: getLink
                }
            });

        function getLinks (linkService, Alertify, commonService) {
            return linkService
                .getLinks()
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
        function getLink (linkService, $stateParams) {
            return linkService
                .getLinkById($stateParams.linkId)
                .then(function (res) {
                    console.log(res);
                    var link = {
                        originalLink: [res.data.link.originalLink],

                    };
                    return res.data.link;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }

    }
} ());