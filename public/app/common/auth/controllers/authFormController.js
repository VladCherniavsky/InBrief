(function () {
    angular
        .module('InBrief')
        .controller('AuthFormController', AuthFormController);

    function AuthFormController (authService, Alertify, $state) {
        var self = this;
        self.loginTab = true;
        self.login = login;
        self.signup = signup;
        self.cancel = cancel;

        function login (user) {
            console.log('user', user);
            authService
                .loginUser(user)
                .then(loginSuccess)
                .catch(errorHandler);

            function loginSuccess (res) {
                $state.go('home');
                Alertify.success(res.data);
                self.close();
            }
        }
        function signup (user) {
            authService.
                signupUser(user)
                .then(signUpSuccess)
                .catch(errorHandler);

            function signUpSuccess (res) {
                Alertify.success(res.data);
                Alertify.success('Log in, please');
                self.loginTab = true;
                self.user = null;
            }
        }

        function cancel () {
            self.user = null;
            self.close();
        }
        function errorHandler (err) {
            console.log(err);
            Alertify.error(err.data.message);
        }
    }
}());