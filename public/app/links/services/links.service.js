(function() {
    angular
        .module('InBrief')
        .service('linkService', linkService);

    function linkService($http) {
        var self = this;
        self.getLinks = getLinks;
        self.addLink = addLink;
        self.getUserLinks = getUserLinks;
        self.getLinkById = getLinkById;
        self.updateLink = updateLink;
        self.deleteLink = deleteLink;
        self.getLinkByTag = getLinkByTag;

        function getLinks (paginationSet) {
            return $http({
                method: 'GET',
                url: 'api/links',
                params: paginationSet
            });
        }

        function addLink (link) {
            return $http({
                method: 'POST',
                url: 'api/links',
                data: link
            });
        }

        function getUserLinks (paginationSet) {
            return $http({
                method: 'GET',
                url: 'api/userLinks',
                params: paginationSet
            });
        }
        function getLinkById (linkId) {
            return $http({
                method: 'GET',
                url: 'api/links/' + linkId
            });
        }
        function updateLink (editedLink) {
            return $http({
                method: 'PUT',
                url: 'api/links',
                data: editedLink
            });
        }
        function deleteLink (linkId) {
            return $http({
                method: 'DELETE',
                url: 'api/links/' + linkId
            });
        }
        function getLinkByTag (tag, paginationSet) {
            return $http({
                method: 'GET',
                url: 'api/linksByTag/' + tag,
                params: paginationSet
            });
        }

    }
}());