(function () {
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService) {
        var self = this;
        linkService.getLinks().then(function (res) {
            console.log(res);
        });
    }
}());