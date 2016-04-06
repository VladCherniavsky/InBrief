(function() {
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor ($cookies, $rootScope) {
        var authIntercepor = {
            request: function (config) {
                var token = $cookies.get('token');

                return config;
            },
            response: function(response) {
                var token = response.headers('x-access-token');

                if (token !== null) {
                    console.log('check',response.headers('x-access-token'));
                    $cookies.put('token', token);
                    $cookies.put('id', response.data.user.id);
                    $cookies.put('userName', response.data.user.userName);
                    $rootScope.$broadcast('logged');
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());