(function () {
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (data, $uibModalInstance) {
        var self = this;
        self.title = 'Link details';
        self.editorEnabled = false;
        self.link = data.link;
        self.sum = data.sum;
        self.close = close;
        self.edit = edit;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function edit () {
            self.title = 'Link edit';
            self.editorEnabled = true;
        }
    }
}());