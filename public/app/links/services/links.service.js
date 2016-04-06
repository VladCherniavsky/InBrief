(function() {
    angular
        .module('InBrief')
        .service('linkService', linkService);

    function linkService($http) {
        var self = this;
        self.getLinks = getLinks;

        function getLinks (user) {
            return $http({
                method: 'GET',
                url: 'api/links'
            })
        }

    }
}());