(function () {
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService, resolvedLinks) {
        var self = this;
        self.title = 'All links: ' + resolvedLinks.count;
        self.links = resolvedLinks.links;
    }
}());