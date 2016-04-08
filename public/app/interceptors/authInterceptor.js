(function() {
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor ($cookies, $rootScope) {
        var authIntercepor = {
            response: function(response) {
                var token = response.headers('x-access-token'),
                    id = response.headers('id'),
                    userName = response.headers('userName');

                if (token !== null) {
                    $cookies.put('token', token);
                    if (id) { $cookies.put('id', id); }
                    if (userName) { $cookies.put('userName', userName); }
                    $rootScope.$broadcast('logged');
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());