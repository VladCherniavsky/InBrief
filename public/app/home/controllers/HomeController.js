(function () {
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController ($rootScope, linkService, Alertify) {
        var self = this;
        self.logged = $rootScope.logged;
        self.addLink = addLink;

        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        function addLink (link) {
            console.log('link', link);
            link.tags = link.tags.split();
            console.log('link', link);
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);
        }

        function addLinkResult (res) {
            self.link = null;
            console.log('res', res);
            Alertify.success(res.data.message);
        }
        function addLinkError (err) {
            Alertify.error(res.data.message);
        }

        function loggedProcess () {
            self.logged = true;
        }
        
        function logoutProcess () {
            self.logged = false;
            $rootScope.logged = false;
        }

    }
}());