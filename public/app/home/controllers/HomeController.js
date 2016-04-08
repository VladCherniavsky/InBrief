(function () {
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController (resolvedUserLinks, Alertify, linkService) {
        var self = this;
        self.title = 'My links';
        self.addLink = addLink;
        self.userLinks = resolvedUserLinks;
        self.change = change;

        function addLink (link) {
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);

            function addLinkResult (res) {
                self.link = null;
                self.change();
                Alertify.success(res.data.message);
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
                self.userLinks = res.data;
            }

            function getLinksError (err) {
                Alertify.error(err.data.message);
            }
        }
    }
}());