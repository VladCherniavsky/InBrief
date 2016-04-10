(function () {
    angular
        .module('InBrief')
        .controller('LinkFormController', LinkFormController);

    function LinkFormController () {
        var self = this;
        self.save = save;
        self.cancel = cancel;

        function save (link) {
            self.action({link: link});
        }
        function cancel (link) {
            self.link = null;
            self.close();
        }

    }
} ());