(function() {
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor ($cookies, $rootScope) {
        var authIntercepor = {
            request: function (config) {
                return config;
            },
            response: function(response) {
                var token = response.headers('x-access-token');
                if (token !== null) {
                    $cookies.put('token', token);
                    if (response.data.user) { $cookies.put('id', response.data.user.id); }
                    if (response.data.user) { $cookies.put('userName', response.data.user.userName); }
                    $rootScope.$broadcast('logged');
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());