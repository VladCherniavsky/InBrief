(function () {
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService, resolvedLinks) {
        var self = this;
        self.links = resolvedLinks;
        self.linkss = [{
            originalLink: 'jjj',
            shortLink: 'hhh'
        }];
    }
}());