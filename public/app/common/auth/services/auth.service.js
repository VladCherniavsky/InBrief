(function(){
    angular
        .module('InBrief')
        .service('authService', authService );

    function authService($http){
        var self = this;
        self.loginUser = loginUser;
        self.signupUser = signupUser;

        function loginUser (user) {
            return  $http({
                method: 'POST',
                url: 'api/login',
                data: user
            })
        }
        function signupUser (user) {
            return  $http({
                method: 'POST',
                url: 'api/signup',
                data: user
            })
        }
    }
}());