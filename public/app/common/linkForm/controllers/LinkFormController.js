(function () {
    angular
        .module('InBrief')
        .controller('LinkFormController', LinkFormController);

    function LinkFormController ($timeout) {
        var self = this;
        self.save = save;
        self.cancel = cancel;

        function save (link) {
            console.log('self', self);
            self.action({link: link});
        }
        function cancel (link) {
            self.link = null;
        }
        $timeout(function () {}, 0);
    }
} ());