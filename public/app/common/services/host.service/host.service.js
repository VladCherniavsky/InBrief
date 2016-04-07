(function() {
    angular
        .module('InBrief')
        .service('hostService', hostService);

    function hostService($location) {
        var self = this;
        self.getHost = getHost;

        function getHost () {
            return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
    }
}());