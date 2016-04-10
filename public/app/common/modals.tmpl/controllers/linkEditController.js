(function () {
    angular
        .module('InBrief')
        .controller('LinkEditController', LinkEditController);

    function LinkEditController (data, $uibModalInstance, linkService, Alertify) {
        console.log('link', data);
        var self = this;
        self.title = 'Edit link';
        self.linkToEdit = data;
        self.save = save;
        self.close = close;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function save (editedLink) {
            console.log('editedLink)', editedLink);
            linkService.updateLink(editedLink)
                .then(function (res) {
                    Alertify.success('Link updated successfully');
                    close();
                })
                .catch(function () {
                    Alertify.error(err.data.message);
                });
        }
    }
}());