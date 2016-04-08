(function () {
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (data) {
        var self = this;
        self.title = 'Link details';
        self.link = data.link;
        self.sum = data.sum;
    }
}());