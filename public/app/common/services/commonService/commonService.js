(function() {
    angular
        .module('InBrief')
        .service('commonService', commonService);

    function commonService($location, $window, $rootScope) {
        var self = this;
        self.getHost = getHost;
        self.checkEdit = checkEdit;
        self.getPaginationSet = getPaginationSet;

        function getHost () {
            return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
        function checkEdit (links) {
            angular.forEach(links, function(value, key) {
                value.editable = $window.localStorage.id == value.userId && $rootScope.logged;
            });
            return links;

        }
        function getPaginationSet (page, perPage) {
            var defaultSet = {
                page: page ? page : 1,
                perPage: perPage ? perPage : 2
            };
            return {
                skip: (defaultSet.page - 1) * defaultSet.perPage,
                limit: defaultSet.perPage
            }

        }
    }
}());