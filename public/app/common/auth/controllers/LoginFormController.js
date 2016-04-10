(function () {
    angular
        .module('InBrief')
        .controller('LoginFormController', LoginFormController);

    function LoginFormController (authService, Alertify, $state, $rootScope) {
        var self = this;
        self.save = save;
        self.cancel = cancel;

        function save (user) {
            self.submit({user: user});
        }
        function cancel () {
            self.user = null;
            self.close();
        }

    }
}());