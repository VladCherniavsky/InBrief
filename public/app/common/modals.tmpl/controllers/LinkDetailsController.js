(function () {
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (data, $uibModalInstance, $state) {
        var self = this;
        self.title = 'Link details';
        self.editorEnabled = false;
        self.link = data.link;
        self.sum = data.sum;
        self.close = close;
        self.getLinksByTag = getLinksByTag;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function getLinksByTag (tag) {
            $state.go('tag', {tag: tag})
            self.close();
        }

    }
}());