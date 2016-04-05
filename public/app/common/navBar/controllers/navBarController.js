(function () {
    angular
        .module('InBrief')
        .controller('NavBarController', NavBarController);

    function NavBarController ($uibModal) {
        var self = this;

        self.animationsEnabled = true;
        self.open = open;

        function open (size) {
            var modalInstance = $uibModal.open({
                animation: self.animationsEnabled,
                templateUrl: 'common/navBar/views/modalAuth-tmpl.html',
                controller: 'ModalAuthController',
                controllerAs: 'modalAuth',
                size: size
            });

            /*modalInstance.result.then(function (selectedItem) {
                self.selected = selectedItem;
            }, function () {
            });*/
        }


    }
}());