(function () {
    angular
        .module('InBrief')
        .controller('LinksByTagController', LinksByTagController);

    function LinksByTagController (linkService, Alertify, commonService, resolvedByTag, $stateParams) {
        var self = this;
        self.title = 'We have ' + resolvedByTag.count + ' links with tag: ' + $stateParams.tag;
        self.links = resolvedByTag.links;
        self.count = resolvedByTag.count;
        self.currentPage = 1;
        self.itemsPerPage = 2;
        self.pageChanged = pageChanged;

        function pageChanged () {
            linkService
                .getLinks(commonService.getPaginationSet(self.currentPage, self.itemsPerPage))
                .then(getLinksSuccess)
                .catch(getLinksError);

            function getLinksSuccess (res) {
                self.links = res.data.links;
            }
            function getLinksError () {
                Alertify.error(err.data.message);
            }
        }
    }
}());