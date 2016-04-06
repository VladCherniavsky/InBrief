(function() {
    angular
        .module('InBrief')
        .service('linkService', linkService);

    function linkService($http) {
        var self = this;
        self.getLinks = getLinks;
        self.addLink = addLink;

        function getLinks (user) {
            return $http({
                method: 'GET',
                url: 'api/links'
            })
        }

        function addLink (link) {
            return  $http({
                method: 'POST',
                url: 'api/links',
                data: link
            })
        }

    }
}());