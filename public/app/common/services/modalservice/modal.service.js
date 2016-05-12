(function() {
    angular
        .module('InBrief')
        .service('modalService', modalService);

    function modalService($uibModal) {
        var self = this;
        self.getModal = getModal;

        function getModal(animationsEnabled, pathToTmpl, controller, controllerAs, data) {
            return $uibModal.open({
                animation: animationsEnabled,
                templateUrl: pathToTmpl,
                controller: controller,
                controllerAs: controllerAs,
                resolve: {
                    data: function() {
                        return data;
                    }
                }

            });
        }
    }
}());
