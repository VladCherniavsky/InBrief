(function () {
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController (resolvedUserLinks, Alertify, linkService, commonService, $rootScope) {
        var self = this;
        self.currentPage = 1;
        self.itemsPerPage = 5;
        self.addLink = addLink;
        self.pageChanged = pageChanged;
        self.deleteLink = deleteLink;
        
        if ($rootScope.logged) {
            self.userLinks = resolvedUserLinks.links;
            self.count = resolvedUserLinks.count;
            self.title = getTitle(resolvedUserLinks.count);
        }

        function addLink (link) {
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);

            function addLinkResult (res) {
                self.link = null;
                self.pageChanged();
                Alertify.success('Link added successfully');
            }
            function addLinkError (err) {
                Alertify.error(err.data.message);
            }
        }
        function pageChanged () {
            linkService
                .getUserLinks(commonService.getPaginationSet(self.currentPage, self.itemsPerPage))
                .then(getLinksResult)
                .catch(getLinksError);

            function getLinksResult (res) {
                self.userLinks = commonService.checkEdit(res.data.links);
                self.count = res.data.count;
                getTitle(res.data.count);
            }
            function getLinksError (err) {
                Alertify.error(err.data.message);
            }
        }
        function getTitle (count) {
            self.title = 'My links:' + count;
            return self.title;
        }
        function deleteLink (linkId) {
            Alertify
                .confirm('Do you want to delete this link?')
                .then(positiveAnsver);

            function positiveAnsver () {
                linkService.deleteLink(linkId)
                    .then(function () {
                        Alertify.success('Link removed successfully');
                        pageChanged();
                    })
                    .catch(function (err) {
                        console.log(err);
                        Alertify.error(err.data.message);
                    });
            }

        }
    }
}());