(function () {
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController (resolvedUserLinks, Alertify, linkService, commonService, $timeout, $scope) {
        var self = this;
        self.title = getTitle(resolvedUserLinks.count);
        self.addLink = addLink;
        self.userLinks = resolvedUserLinks.links;
        self.change = change;

        function addLink (link) {
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);

            function addLinkResult (res) {
                self.link = null;
                self.change();
                Alertify.success(res.data);
            }
            function addLinkError (err) {
                Alertify.error(err.data.message);
            }
        }
        function change () {
            linkService
                .getUserLinks()
                .then(getLinksResult)
                .catch(getLinksError);

            function getLinksResult (res) {
                console.log(res.data);
                self.userLinks = commonService.checkEdit(res.data.links);
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
    }
}());