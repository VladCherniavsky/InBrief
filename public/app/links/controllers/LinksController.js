(function () {
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService, resolvedLinks, Alertify, commonService) {
        var self = this;
        self.title = 'All links: ' + resolvedLinks.count;
        self.links = resolvedLinks.links;
        self.count = resolvedLinks.count;
        self.currentPage = 1;
        self.itemsPerPage = 5;
        self.pageChanged = pageChanged;

        function pageChanged () {
            linkService
                .getLinks(commonService.getPaginationSet(self.currentPage, self.itemsPerPage))
                .then(getLinksSuccess)
                .catch(getLinksError);

            function getLinksSuccess (res) {
                self.links = res.data.links;
            }
            function getLinksError (err) {
                Alertify.error(err.data.message);
            }
        }
    }
}());