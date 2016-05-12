(function() {
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor($rootScope, $window, $cookies) {
        var authIntercepor = {
            request: function(config) {
                console.log(config);
                config.headers['x-access-token'] = $window.localStorage.token;
                $rootScope.$on('logout', function() {
                    config.headers['x-access-token'] = null;
                });
                return config;
            },
            response: function(response) {

                console.log($rootScope.canLogin);

                var token = response.headers('x-access-token');
                console.log('f', token);
                var id = response.headers('id');
                var userName = response.headers('userName');
                if ($rootScope.canLogin) {
                    if (token !== null) {

                        $cookies.put('id', id);
                        $window.localStorage.token = token;
                        if (id) { $window.localStorage.id = id; }
                        if (userName) { $window.localStorage.userName = userName; }
                        $rootScope.$broadcast('logged');
                    }
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());
