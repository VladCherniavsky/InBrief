(function () {
    angular
        .module('InBrief')
        .controller('AuthFormController', AuthFormController);

    function AuthFormController (authService, Alertify) {
        var self = this;
        self.loginTab = true;
        self.login = login;
        self.signup = signup;
        self.cancel = cancel;


        function login (user) {
            console.log('user', user);
            authService
                .loginUser(user)
                .then(function (res) {
                    if(res.data.success) {
                        Alertify.success(res.data.message);
                    } else {
                        Alertify.error(res.data.message);
                    }
                    self.close();
                }).catch(function (err) {
                    Alertify.error(err.message);
                });
            console.log('user', user);

        }
        function signup (user) {
            authService.
                signupUser(user)
                .then(function (res) {
                    if(res.data.success) {
                        Alertify.success(res.data.message);
                    } else {
                        console.log(res);
                        Alertify.error(res.data.message);
                    }
                    self.loginTab = true;
                    self.user = null;
                }).catch(function (err) {
                    console.log(err);
                    Alertify.error(err.message);
                });

        }

        function cancel () {
            self.user = null;
            self.close();
        }
    }
}());