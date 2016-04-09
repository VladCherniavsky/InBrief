(function() {
    angular
        .module('InBrief')
        .service('commonService', commonService);

    function commonService($location, $window, $rootScope) {
        var self = this;
        self.getHost = getHost;
        self.checkEdit = checkEdit;

        function getHost () {
            return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
        function checkEdit (links) {
            angular.forEach(links, function(value, key) {
                value.editable = $window.localStorage.id == value.userId && $rootScope.logged;
            });
            return links;

        }
    }
}());