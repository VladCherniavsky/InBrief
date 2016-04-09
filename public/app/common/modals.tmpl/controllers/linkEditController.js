(function () {
    angular
        .module('InBrief')
        .controller('LinkEditController', LinkEditController);

    function LinkEditController (data, $uibModalInstance, $timeout) {
        console.log('link', data);
        var self = this;
        self.title = 'Edit link';
        self.linkToEdit = data;
        self.save = save;
        console.log('link', data);

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function save (editedLink) {
            console.log('editedLink)', editedLink);
        }
       /* $timeout(function () {

            console.log('settimeout', data.originalLink);
        }, 150);*/
    }
}());