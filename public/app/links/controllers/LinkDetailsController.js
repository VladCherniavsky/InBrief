(function () {
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (linkService) {
        var self = this;
        self.title = 'Link details';
    }
}());