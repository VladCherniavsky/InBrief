(function () {
    angular
        .module('InBrief')
        .controller('LinkEditController', LinkEditController);

    function LinkEditController (data, $uibModalInstance, linkService, Alertify) {
        var self = this;
        self.title = 'Edit link';
        self.linkToEdit = data;
        self.save = save;
        self.close = close;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function save (editedLink) {
            linkService.updateLink(editedLink)
                .then(function () {
                    Alertify.success('Link updated successfully');
                    close();
                })
                .catch(function (err) {
                    Alertify.error(err.data.message);
                });
        }
    }
}());