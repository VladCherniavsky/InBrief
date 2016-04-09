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

        function getLinks () {
            return $http({
                method: 'GET',
                url: 'api/links'
            });
        }

        function addLink (link) {
            return $http({
                method: 'POST',
                url: 'api/links',
                data: link
            });
        }

        function getUserLinks () {
            return $http({
                method: 'GET',
                url: 'api/userLinks'
            });
        }
        function getLinkById (linkId) {

            console.log('linkId', linkId);
            return $http({
                method: 'GET',
                url: 'api/links/' + linkId
            });
        }
        function updateLink (editedLink) {
            console.log('editedLink', editedLink);
            return $http({
                method: 'PUT',
                url: 'api/links',
                data: editedLink
            });
        }
        function deleteLink (linkId) {
            console.log('linkId', linkId);
            return $http({
                method: 'DELETE',
                url: 'api/links/' + linkId
            });
        }

    }
}());