(function() {
    config.$inject = ["$httpProvider"];
    runBlock.$inject = ["$rootScope", "$window", "authService", "commonService"];
    angular
        .module('InBrief', [
            'ui.router',
            'Alertify',
            'ui.bootstrap',
            'ngCookies'
        ])
        .config(config)
        .run(runBlock);

    function config ($httpProvider) {
        $httpProvider.interceptors.push('authIntercepor');
    }
    function runBlock ($rootScope, $window, authService, commonService) {
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);
        $rootScope.host = commonService.getHost();

        if ($window.localStorage.token) {
            authService.defaultRequest();
            $rootScope.canLogin = true;
        }
        function loggedProcess () {
            $rootScope.logged = true;
        }

        function logoutProcess () {
            $window.localStorage.clear();;
            $rootScope.logged = false;
            $rootScope.canLogin = false;

        }
    }
}());
(function() {
    modalService.$inject = ["$uibModal"];
    angular
        .module('InBrief')
        .service('modalService', modalService);

    function modalService($uibModal) {
        var self = this;
        self.getModal = getModal;

        function getModal (animationsEnabled, pathToTmpl, controller, controllerAs, data) {
            return $uibModal.open({
                animation: animationsEnabled,
                templateUrl: pathToTmpl,
                controller: controller,
                controllerAs: controllerAs,
                resolve: {
                    data: function () {
                        return data;
                    }
                }

            });
        }
    }
}());
(function() {
    commonService.$inject = ["$location", "$window", "$rootScope"];
    angular
        .module('InBrief')
        .service('commonService', commonService);

    function commonService($location, $window, $rootScope) {
        var self = this;
        self.getHost = getHost;
        self.checkEdit = checkEdit;

        function getHost () {
            return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
        function checkEdit (links) {
            angular.forEach(links, function(value, key) {
                value.editable = $window.localStorage.id == value.userId && $rootScope.logged;
            });
            return links;

        }
    }
}());
(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('navBar', navBarFn);

    function navBarFn () {
        return {
            restrict: 'E',
            templateUrl: 'common/navBar/views/nav-bar-tmpl.html',
            controller: 'NavBarController',
            controllerAs: 'navBar'
        };
    }
}());
(function () {
    NavBarController.$inject = ["$rootScope", "modalService", "$state"];
    angular
        .module('InBrief')
        .controller('NavBarController', NavBarController);

    function NavBarController ($rootScope, modalService, $state) {
        var self = this;
        self.open = open;
        self.logout = logout;

        function open () {
            var modalInstance = modalService.getModal(true,
                'common/modals.tmpl/templates/modalAuth.tmpl.html',
                'ModalAuthController',
                'modalAuth');
        }
        function logout () {
            $rootScope.$broadcast('logout');
            $state.go('home');
        }
    }
}());
(function () {
    ModalAuthController.$inject = ["$uibModalInstance"];
    angular
        .module('InBrief')
        .controller('ModalAuthController', ModalAuthController);

    function ModalAuthController ($uibModalInstance) {
        var self = this;
        self.ok = function () {
            $uibModalInstance.close();
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
}());
(function () {
    LinkDetailsController.$inject = ["data", "$uibModalInstance"];
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (data, $uibModalInstance) {
        var self = this;
        self.title = 'Link details';
        self.editorEnabled = false;
        self.link = data.link;
        self.sum = data.sum;
        self.close = close;
        self.edit = edit;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function edit () {
            self.title = 'Link edit';
            self.editorEnabled = true;
        }
    }
}());
(function () {
    LinkEditController.$inject = ["data", "$uibModalInstance", "$timeout"];
    angular
        .module('InBrief')
        .controller('LinkEditController', LinkEditController);

    function LinkEditController (data, $uibModalInstance, $timeout) {
        console.log('link', data);
        var self = this;
        self.title = 'Edit link';
        self.linkToEdit = data;
        self.save = save;
        console.log('link', data);

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function save (editedLink) {
            console.log('editedLink)', editedLink);
        }
       /* $timeout(function () {

            console.log('settimeout', data.originalLink);
        }, 150);*/
    }
}());
(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('linksTable', linksTable);

    function linksTable () {
        return {
            restrict: 'E',
            templateUrl: 'common/linksTable/template/linksTable-tmpl.html',
            controller: 'LinksTableController',
            controllerAs: 'linksTableCtrl',
            bindToController: {
                links: '=',
                details: '&',
                title: '='
            }
        };
    }
}());
(function () {
    LinksTableController.$inject = ["modalService", "linkService", "Alertify", "$state"];
    angular
        .module('InBrief')
        .controller('LinksTableController', LinksTableController);

    function LinksTableController (modalService, linkService, Alertify, $state) {
        var self = this;
        self.linkDetails = linkDetails;
        self.editLink = editLink;
        self.deleteLink = deleteLink;

        function linkDetails (linkId) {
            console.log('linkId', linkId);
            linkService
                .getLinkById(linkId)
                .then(getlinkDetailsSuccess)
                .catch(getlinkDetailsError);

            function getlinkDetailsSuccess (res) {
                console.log('res.data', res.data);
                var modalInstance = modalService.getModal(true,
                    'common/modals.tmpl/templates/linkDetails.tmpl.html',
                    'LinkDetailsController',
                    'linkDetails',
                    res.data);
            }
            function getlinkDetailsError (err) {
                Alertify.error(err.data.message);
            }
        }

        function editLink (linkId) {
            $state.go('edit', {linkId: linkId});
        }
        function deleteLink (linkId) {
            linkService.deleteLink(linkId)
                .then(function () {
                    Alertify.success('Link is deleted successfully');
                })
                .catch(function (err) {
                    Alertify.error(err.data.message);
                });

        }

    }
}());
(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('linkForm', linkForm);

    function linkForm () {
        return {
            restrict: 'E',
            templateUrl: 'common/linkForm/template/linkForm-tmpl.html',
            controller: 'LinkFormController',
            controllerAs: 'linkFormCtrl',
            bindToController: {
                action: '&',
                link: '='

            }
        };
    }
}());
(function () {
    LinkFormController.$inject = ["$timeout"];
    angular
        .module('InBrief')
        .controller('LinkFormController', LinkFormController);

    function LinkFormController ($timeout) {
        var self = this;
        self.save = save;
        self.cancel = cancel;

        function save (link) {
            console.log('self', self);
            self.action({link: link});
        }
        function cancel (link) {
            self.link = null;
        }
        $timeout(function () {}, 0);
    }
} ());
(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('authForm', authForm);

    function authForm () {
        return {
            restrict: 'E',
            templateUrl: 'common/auth/tmpl/auth-form-tmpl.html',
            controller: 'AuthFormController',
            controllerAs: 'authform',
            bindToController: {
                close: '&'
            }
        };
    }
}());
(function() {
    authService.$inject = ["$http"];
    angular
        .module('InBrief')
        .service('authService', authService);

    function authService($http) {
        var self = this;
        self.loginUser = loginUser;
        self.signupUser = signupUser;
        self.defaultRequest = defaultRequest;

        function loginUser (user) {
            return $http({
                method: 'POST',
                url: 'api/login',
                data: user
            });
        }
        function signupUser (user) {
            return $http({
                method: 'POST',
                url: 'api/signup',
                data: user
            });
        }
        function defaultRequest () {
            return $http({
                method: 'GET',
                url: 'api/'
            });
        }
    }
}());
(function () {
    AuthFormController.$inject = ["authService", "Alertify", "$state", "$rootScope"];
    angular
        .module('InBrief')
        .controller('AuthFormController', AuthFormController);

    function AuthFormController (authService, Alertify, $state, $rootScope) {
        var self = this;
        self.loginTab = true;
        self.login = login;
        self.signup = signup;
        self.cancel = cancel;

        function login (user) {
            console.log('user', user);
            $rootScope.canLogin = true;
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
            if (err.data.errors) {
                for (var key in err.data.errors) {
                    if (!err.data.errors.hasOwnProperty(key)) { continue }
                    Alertify.error(err.data.errors[key].message);

                }
            } else {
                Alertify.error(err.data.message);
            }
        }
    }
}());
(function() {
    linkService.$inject = ["$http"];
    angular
        .module('InBrief')
        .service('linkService', linkService);

    function linkService($http) {
        var self = this;
        self.getLinks = getLinks;
        self.addLink = addLink;
        self.getUserLinks = getUserLinks;
        self.getLinkById = getLinkById;
        self.updateLink = updateLink;
        self.deleteLink = deleteLink;

        function getLinks () {
            return $http({
                method: 'GET',
                url: 'api/links'
            });
        }

        function addLink (link) {
            return $http({
                method: 'POST',
                url: 'api/links',
                data: link
            });
        }

        function getUserLinks () {
            return $http({
                method: 'GET',
                url: 'api/userLinks'
            });
        }
        function getLinkById (linkId) {

            console.log('linkId', linkId);
            return $http({
                method: 'GET',
                url: 'api/links/' + linkId
            });
        }
        function updateLink (editedLink) {
            console.log('editedLink', editedLink);
            return $http({
                method: 'PUT',
                url: 'api/links',
                data: editedLink
            });
        }
        function deleteLink (linkId) {
            console.log('linkId', linkId);
            return $http({
                method: 'DELETE',
                url: 'api/links/' + linkId
            });
        }

    }
}());
(function () {
    config.$inject = ["$stateProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        getLinks.$inject = ["linkService", "Alertify", "commonService"];
        getLink.$inject = ["linkService", "$stateParams"];
        console.log('$stateProvider', $stateProvider);
        $stateProvider
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html',
                controller: 'LinksController',
                controllerAs: 'linksCtrl',
                resolve: {
                    resolvedLinks: getLinks
                }
            })
            .state('details', {
                url: '/details',
                templateUrl: 'links/views/linkDetails.html',
                controller: 'LinkDetailsController',
                controllerAs: 'linkDetails'
            })
            .state('edit', {
                url: '/edit/:linkId',
                templateUrl: 'links/views/editLink.html',
                controller: 'EditLinkController',
                controllerAs: 'editLink',
                resolve: {
                    resolvedLink: getLink
                }
            });

        function getLinks (linkService, Alertify, commonService) {
            return linkService
                .getLinks()
                .then(function (res) {
                    return {
                        links: commonService.checkEdit(res.data.links),
                        count: res.data.count
                    };
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }
        function getLink (linkService, $stateParams) {
            return linkService
                .getLinkById($stateParams.linkId)
                .then(function (res) {
                    console.log(res);
                    var link = {
                        originalLink: [res.data.link.originalLink],

                    };
                    return res.data.link;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }

    }
} ());
(function () {
    LinksController.$inject = ["linkService", "resolvedLinks"];
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService, resolvedLinks) {
        var self = this;
        self.title = 'All links: ' + resolvedLinks.count;
        self.links = resolvedLinks.links;
    }
}());
(function () {
    EditLinkController.$inject = ["linkService", "resolvedLink", "Alertify"];
    angular
        .module('InBrief')
        .controller('EditLinkController', EditLinkController);

    function EditLinkController (linkService, resolvedLink, Alertify) {
        var self = this;
        self.title = 'Edit link';
        self.link = resolvedLink;
        self.link.original = 'jjjjj';
        self.update = update;

        function update (link) {
            console.log('updatelin', link);
            linkService.updateLink(link)
                .then(function (res) {
                    Alertify.success(res.data);
                })
                .catch(function () {
                    Alertify.error(err.data.message);
                });
        }
    }
}());
(function () {
    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        getUserLinks.$inject = ["linkService", "Alertify", "commonService"];
        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/views/main.html',
                controller: 'HomeController',
                controllerAs: 'home',
                resolve: {
                    resolvedUserLinks: getUserLinks
                }
            });

        function getUserLinks (linkService, Alertify, commonService) {
            return linkService
                .getUserLinks()
                .then(function (res) {
                    commonService.checkEdit(res.data.links)
                    return res.data;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }
    }
} ());
(function () {
    HomeController.$inject = ["resolvedUserLinks", "Alertify", "linkService", "commonService", "$timeout", "$scope"];
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController (resolvedUserLinks, Alertify, linkService, commonService, $timeout, $scope) {
        var self = this;
        self.title = getTitle(resolvedUserLinks.count);
        self.addLink = addLink;
        self.userLinks = resolvedUserLinks.links;
        self.change = change;

        function addLink (link) {
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);

            function addLinkResult (res) {
                self.link = null;
                self.change();
                Alertify.success(res.data);
            }
            function addLinkError (err) {
                Alertify.error(err.data.message);
            }
        }
        function change () {
            linkService
                .getUserLinks()
                .then(getLinksResult)
                .catch(getLinksError);

            function getLinksResult (res) {
                console.log(res.data);
                self.userLinks = commonService.checkEdit(res.data.links);
                getTitle(res.data.count);
            }
            function getLinksError (err) {
                Alertify.error(err.data.message);
            }
        }
        function getTitle (count) {
            self.title = 'My links:' + count;
            return self.title;
        }
    }
}());
(function() {
    authIntercepor.$inject = ["$rootScope", "$window"];
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor ($rootScope, $window) {
        var authIntercepor = {
            request: function (config) {
                config.headers['x-access-token'] = $window.localStorage.token;
                $rootScope.$on('logout', function () {
                    config.headers['x-access-token'] = null;
                });

                return config;
            },
            response: function(response) {
                var token = response.headers('x-access-token'),
                    id = response.headers('id'),
                    userName = response.headers('userName');
                if ($rootScope.canLogin) {
                    if (token !== null) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9tb2RhbC5zZXJ2aWNlL21vZGFsLnNlcnZpY2UuanMiLCJjb21tb24vc2VydmljZXMvY29tbW9uU2VydmljZS9jb21tb25TZXJ2aWNlLmpzIiwiY29tbW9uL25hdkJhci9kaXJlY3RpdmUvbmF2QmFyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9tb2RhbHMudG1wbC9jb250cm9sbGVycy9Nb2RhbEF1dGhDb250cm9sbGVyLmpzIiwiY29tbW9uL21vZGFscy50bXBsL2NvbnRyb2xsZXJzL0xpbmtFZGl0RGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb21tb24vbW9kYWxzLnRtcGwvY29udHJvbGxlcnMvTGlua0VkaXRDb250cm9sbGVyLmpzIiwiY29tbW9uL2xpbmtzVGFibGUvZGlyZWN0aXZlL2xpbmtzVGFibGUuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2xpbmtzVGFibGUvY29udHJvbGxlci9MaW5rc1RhYmxlQ29udHJvbGxlci5qcyIsImNvbW1vbi9saW5rRm9ybS9kaXJlY3RpdmUvbGlua0Zvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2xpbmtGb3JtL2NvbnRyb2xsZXJzL0xpbmtGb3JtQ29udHJvbGxlci5qcyIsImNvbW1vbi9hdXRoL2RpcmVjdGl2ZXMvYXV0aEZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvc2VydmljZXMvbGlua3Muc2VydmljZS5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0NvbnRyb2xsZXIuanMiLCJsaW5rcy9jb250cm9sbGVycy9FZGl0TGlua0NvbnRyb2xsZXIuanMiLCJob21lL3JvdXRlcy9yb3V0ZXMuanMiLCJob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiaW50ZXJjZXB0b3JzL2F1dGhJbnRlcmNlcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRodHRwUHJvdmlkZXJcIl07XHJcbiAgICBydW5CbG9jay4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiR3aW5kb3dcIiwgXCJhdXRoU2VydmljZVwiLCBcImNvbW1vblNlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicsIFtcclxuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXHJcbiAgICAgICAgICAgICdBbGVydGlmeScsXHJcbiAgICAgICAgICAgICd1aS5ib290c3RyYXAnLFxyXG4gICAgICAgICAgICAnbmdDb29raWVzJ1xyXG4gICAgICAgIF0pXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAgICAgLnJ1bihydW5CbG9jayk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29uZmlnICgkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2Vwb3InKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJ1bkJsb2NrICgkcm9vdFNjb3BlLCAkd2luZG93LCBhdXRoU2VydmljZSwgY29tbW9uU2VydmljZSkge1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS5ob3N0ID0gY29tbW9uU2VydmljZS5nZXRIb3N0KCk7XHJcblxyXG4gICAgICAgIGlmICgkd2luZG93LmxvY2FsU3RvcmFnZS50b2tlbikge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5kZWZhdWx0UmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbkxvZ2luID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbG9nZ2VkUHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpOztcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW5Mb2dpbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgbW9kYWxTZXJ2aWNlLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ21vZGFsU2VydmljZScsIG1vZGFsU2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbW9kYWxTZXJ2aWNlKCR1aWJNb2RhbCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmdldE1vZGFsID0gZ2V0TW9kYWw7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vZGFsIChhbmltYXRpb25zRW5hYmxlZCwgcGF0aFRvVG1wbCwgY29udHJvbGxlciwgY29udHJvbGxlckFzLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbnNFbmFibGVkLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IHBhdGhUb1RtcGwsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBjb250cm9sbGVyQXMsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgY29tbW9uU2VydmljZS4kaW5qZWN0ID0gW1wiJGxvY2F0aW9uXCIsIFwiJHdpbmRvd1wiLCBcIiRyb290U2NvcGVcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2NvbW1vblNlcnZpY2UnLCBjb21tb25TZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21tb25TZXJ2aWNlKCRsb2NhdGlvbiwgJHdpbmRvdywgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmdldEhvc3QgPSBnZXRIb3N0O1xyXG4gICAgICAgIHNlbGYuY2hlY2tFZGl0ID0gY2hlY2tFZGl0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRIb3N0ICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi5wcm90b2NvbCgpICsgJzovLycgKyAkbG9jYXRpb24uaG9zdCgpICsgJzonICsgJGxvY2F0aW9uLnBvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tFZGl0IChsaW5rcykge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlua3MsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLmVkaXRhYmxlID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2UuaWQgPT0gdmFsdWUudXNlcklkICYmICRyb290U2NvcGUubG9nZ2VkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtzO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCduYXZCYXInLCBuYXZCYXJGbik7XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2QmFyRm4gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9uYXYtYmFyLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXZCYXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbmF2QmFyJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE5hdkJhckNvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCJtb2RhbFNlcnZpY2VcIiwgXCIkc3RhdGVcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ05hdkJhckNvbnRyb2xsZXInLCBOYXZCYXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBOYXZCYXJDb250cm9sbGVyICgkcm9vdFNjb3BlLCBtb2RhbFNlcnZpY2UsICRzdGF0ZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLm9wZW4gPSBvcGVuO1xyXG4gICAgICAgIHNlbGYubG9nb3V0ID0gbG9nb3V0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuICgpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSBtb2RhbFNlcnZpY2UuZ2V0TW9kYWwodHJ1ZSxcclxuICAgICAgICAgICAgICAgICdjb21tb24vbW9kYWxzLnRtcGwvdGVtcGxhdGVzL21vZGFsQXV0aC50bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgJ01vZGFsQXV0aENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgJ21vZGFsQXV0aCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsQXV0aENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNb2RhbEF1dGhDb250cm9sbGVyJywgTW9kYWxBdXRoQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTW9kYWxBdXRoQ29udHJvbGxlciAoJHVpYk1vZGFsSW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtEZXRhaWxzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiZGF0YVwiLCBcIiR1aWJNb2RhbEluc3RhbmNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rRGV0YWlsc0NvbnRyb2xsZXInLCBMaW5rRGV0YWlsc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtEZXRhaWxzQ29udHJvbGxlciAoZGF0YSwgJHVpYk1vZGFsSW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdMaW5rIGRldGFpbHMnO1xyXG4gICAgICAgIHNlbGYuZWRpdG9yRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHNlbGYubGluayA9IGRhdGEubGluaztcclxuICAgICAgICBzZWxmLnN1bSA9IGRhdGEuc3VtO1xyXG4gICAgICAgIHNlbGYuY2xvc2UgPSBjbG9zZTtcclxuICAgICAgICBzZWxmLmVkaXQgPSBlZGl0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbG9zZSAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBlZGl0ICgpIHtcclxuICAgICAgICAgICAgc2VsZi50aXRsZSA9ICdMaW5rIGVkaXQnO1xyXG4gICAgICAgICAgICBzZWxmLmVkaXRvckVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTGlua0VkaXRDb250cm9sbGVyLiRpbmplY3QgPSBbXCJkYXRhXCIsIFwiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCIkdGltZW91dFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua0VkaXRDb250cm9sbGVyJywgTGlua0VkaXRDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rRWRpdENvbnRyb2xsZXIgKGRhdGEsICR1aWJNb2RhbEluc3RhbmNlLCAkdGltZW91dCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdsaW5rJywgZGF0YSk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYudGl0bGUgPSAnRWRpdCBsaW5rJztcclxuICAgICAgICBzZWxmLmxpbmtUb0VkaXQgPSBkYXRhO1xyXG4gICAgICAgIHNlbGYuc2F2ZSA9IHNhdmU7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2xpbmsnLCBkYXRhKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2UgKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZSAoZWRpdGVkTGluaykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWRpdGVkTGluayknLCBlZGl0ZWRMaW5rKTtcclxuICAgICAgICB9XHJcbiAgICAgICAvKiAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2V0dGltZW91dCcsIGRhdGEub3JpZ2luYWxMaW5rKTtcclxuICAgICAgICB9LCAxNTApOyovXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdsaW5rc1RhYmxlJywgbGlua3NUYWJsZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGlua3NUYWJsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vbGlua3NUYWJsZS90ZW1wbGF0ZS9saW5rc1RhYmxlLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc1RhYmxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2xpbmtzVGFibGVDdHJsJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgbGlua3M6ICc9JyxcclxuICAgICAgICAgICAgICAgIGRldGFpbHM6ICcmJyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnPSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtzVGFibGVDb250cm9sbGVyLiRpbmplY3QgPSBbXCJtb2RhbFNlcnZpY2VcIiwgXCJsaW5rU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCIsIFwiJHN0YXRlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rc1RhYmxlQ29udHJvbGxlcicsIExpbmtzVGFibGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rc1RhYmxlQ29udHJvbGxlciAobW9kYWxTZXJ2aWNlLCBsaW5rU2VydmljZSwgQWxlcnRpZnksICRzdGF0ZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxpbmtEZXRhaWxzID0gbGlua0RldGFpbHM7XHJcbiAgICAgICAgc2VsZi5lZGl0TGluayA9IGVkaXRMaW5rO1xyXG4gICAgICAgIHNlbGYuZGVsZXRlTGluayA9IGRlbGV0ZUxpbms7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmtEZXRhaWxzIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2xpbmtJZCcsIGxpbmtJZCk7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua0J5SWQobGlua0lkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZ2V0bGlua0RldGFpbHNTdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldGxpbmtEZXRhaWxzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0bGlua0RldGFpbHNTdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMuZGF0YScsIHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gbW9kYWxTZXJ2aWNlLmdldE1vZGFsKHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbW1vbi9tb2RhbHMudG1wbC90ZW1wbGF0ZXMvbGlua0RldGFpbHMudG1wbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAnTGlua0RldGFpbHNDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnbGlua0RldGFpbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRsaW5rRGV0YWlsc0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBlZGl0TGluayAobGlua0lkKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygnZWRpdCcsIHtsaW5rSWQ6IGxpbmtJZH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWxldGVMaW5rIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2UuZGVsZXRlTGluayhsaW5rSWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcygnTGluayBpcyBkZWxldGVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xpbmtGb3JtJywgbGlua0Zvcm0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtGb3JtICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9saW5rRm9ybS90ZW1wbGF0ZS9saW5rRm9ybS10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua0Zvcm1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua0Zvcm1DdHJsJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnJicsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiAnPSdcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBMaW5rRm9ybUNvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR0aW1lb3V0XCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rRm9ybUNvbnRyb2xsZXInLCBMaW5rRm9ybUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtGb3JtQ29udHJvbGxlciAoJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5zYXZlID0gc2F2ZTtcclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGNhbmNlbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZSAobGluaykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZicsIHNlbGYpO1xyXG4gICAgICAgICAgICBzZWxmLmFjdGlvbih7bGluazogbGlua30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwgKGxpbmspIHtcclxuICAgICAgICAgICAgc2VsZi5saW5rID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge30sIDApO1xyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2F1dGhGb3JtJywgYXV0aEZvcm0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhGb3JtICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9hdXRoL3RtcGwvYXV0aC1mb3JtLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBdXRoRm9ybUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhdXRoZm9ybScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlOiAnJidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxvZ2luVXNlciA9IGxvZ2luVXNlcjtcclxuICAgICAgICBzZWxmLnNpZ251cFVzZXIgPSBzaWdudXBVc2VyO1xyXG4gICAgICAgIHNlbGYuZGVmYXVsdFJlcXVlc3QgPSBkZWZhdWx0UmVxdWVzdDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaWdudXBVc2VyICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9zaWdudXAnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZGVmYXVsdFJlcXVlc3QgKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS8nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgQXV0aEZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCIsIFwiJHN0YXRlXCIsIFwiJHJvb3RTY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignQXV0aEZvcm1Db250cm9sbGVyJywgQXV0aEZvcm1Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBBdXRoRm9ybUNvbnRyb2xsZXIgKGF1dGhTZXJ2aWNlLCBBbGVydGlmeSwgJHN0YXRlLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYubG9naW4gPSBsb2dpbjtcclxuICAgICAgICBzZWxmLnNpZ251cCA9IHNpZ251cDtcclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGNhbmNlbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW5Mb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAubG9naW5Vc2VyKHVzZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihsb2dpblN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvZ2luU3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cCAodXNlcikge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5cclxuICAgICAgICAgICAgICAgIHNpZ251cFVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKHNpZ25VcFN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNpZ25VcFN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKCdMb2cgaW4sIHBsZWFzZScpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwgKCkge1xyXG4gICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlciAoZXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIuZGF0YS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBlcnIuZGF0YS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVyci5kYXRhLmVycm9ycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IGNvbnRpbnVlIH1cclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5lcnJvcnNba2V5XS5tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBsaW5rU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2xpbmtTZXJ2aWNlJywgbGlua1NlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZ2V0TGlua3MgPSBnZXRMaW5rcztcclxuICAgICAgICBzZWxmLmFkZExpbmsgPSBhZGRMaW5rO1xyXG4gICAgICAgIHNlbGYuZ2V0VXNlckxpbmtzID0gZ2V0VXNlckxpbmtzO1xyXG4gICAgICAgIHNlbGYuZ2V0TGlua0J5SWQgPSBnZXRMaW5rQnlJZDtcclxuICAgICAgICBzZWxmLnVwZGF0ZUxpbmsgPSB1cGRhdGVMaW5rO1xyXG4gICAgICAgIHNlbGYuZGVsZXRlTGluayA9IGRlbGV0ZUxpbms7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGluayAobGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogbGlua1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFVzZXJMaW5rcyAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3VzZXJMaW5rcydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtCeUlkIChsaW5rSWQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsaW5rSWQnLCBsaW5rSWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rcy8nICsgbGlua0lkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVMaW5rIChlZGl0ZWRMaW5rKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZGl0ZWRMaW5rJywgZWRpdGVkTGluayk7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGVkaXRlZExpbmtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUxpbmsgKGxpbmtJZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbGlua0lkJywgbGlua0lkKTtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MvJyArIGxpbmtJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgZ2V0TGlua3MuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIiwgXCJjb21tb25TZXJ2aWNlXCJdO1xyXG4gICAgICAgIGdldExpbmsuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwiJHN0YXRlUGFyYW1zXCJdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCckc3RhdGVQcm92aWRlcicsICRzdGF0ZVByb3ZpZGVyKTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2xpbmtzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbGlzdExpbmtzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpbmtzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rc0N0cmwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkTGlua3M6IGdldExpbmtzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnZGV0YWlscycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbGlua0RldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua0RldGFpbHNDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2xpbmtEZXRhaWxzJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZWRpdC86bGlua0lkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvZWRpdExpbmsuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdExpbmtDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2VkaXRMaW5rJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZExpbms6IGdldExpbmtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzIChsaW5rU2VydmljZSwgQWxlcnRpZnksIGNvbW1vblNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua3MoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtzOiBjb21tb25TZXJ2aWNlLmNoZWNrRWRpdChyZXMuZGF0YS5saW5rcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiByZXMuZGF0YS5jb3VudFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmsgKGxpbmtTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua0J5SWQoJHN0YXRlUGFyYW1zLmxpbmtJZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbExpbms6IFtyZXMuZGF0YS5saW5rLm9yaWdpbmFsTGlua10sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhLmxpbms7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJyZXNvbHZlZExpbmtzXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rc0NvbnRyb2xsZXInLCBMaW5rc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtzQ29udHJvbGxlciAobGlua1NlcnZpY2UsIHJlc29sdmVkTGlua3MpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdBbGwgbGlua3M6ICcgKyByZXNvbHZlZExpbmtzLmNvdW50O1xyXG4gICAgICAgIHNlbGYubGlua3MgPSByZXNvbHZlZExpbmtzLmxpbmtzO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBFZGl0TGlua0NvbnRyb2xsZXIuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwicmVzb2x2ZWRMaW5rXCIsIFwiQWxlcnRpZnlcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRMaW5rQ29udHJvbGxlcicsIEVkaXRMaW5rQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gRWRpdExpbmtDb250cm9sbGVyIChsaW5rU2VydmljZSwgcmVzb2x2ZWRMaW5rLCBBbGVydGlmeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0VkaXQgbGluayc7XHJcbiAgICAgICAgc2VsZi5saW5rID0gcmVzb2x2ZWRMaW5rO1xyXG4gICAgICAgIHNlbGYubGluay5vcmlnaW5hbCA9ICdqampqaic7XHJcbiAgICAgICAgc2VsZi51cGRhdGUgPSB1cGRhdGU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSAobGluaykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlbGluJywgbGluayk7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlLnVwZGF0ZUxpbmsobGluaylcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJHVybFJvdXRlclByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgICBnZXRVc2VyTGlua3MuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIiwgXCJjb21tb25TZXJ2aWNlXCJdO1xyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ2hvbWUnKTtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2hvbWUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lL3ZpZXdzL21haW4uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnaG9tZScsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRVc2VyTGlua3M6IGdldFVzZXJMaW5rc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VXNlckxpbmtzIChsaW5rU2VydmljZSwgQWxlcnRpZnksIGNvbW1vblNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0VXNlckxpbmtzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb25TZXJ2aWNlLmNoZWNrRWRpdChyZXMuZGF0YS5saW5rcylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgSG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcInJlc29sdmVkVXNlckxpbmtzXCIsIFwiQWxlcnRpZnlcIiwgXCJsaW5rU2VydmljZVwiLCBcImNvbW1vblNlcnZpY2VcIiwgXCIkdGltZW91dFwiLCBcIiRzY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIgKHJlc29sdmVkVXNlckxpbmtzLCBBbGVydGlmeSwgbGlua1NlcnZpY2UsIGNvbW1vblNlcnZpY2UsICR0aW1lb3V0LCAkc2NvcGUpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9IGdldFRpdGxlKHJlc29sdmVkVXNlckxpbmtzLmNvdW50KTtcclxuICAgICAgICBzZWxmLmFkZExpbmsgPSBhZGRMaW5rO1xyXG4gICAgICAgIHNlbGYudXNlckxpbmtzID0gcmVzb2x2ZWRVc2VyTGlua3MubGlua3M7XHJcbiAgICAgICAgc2VsZi5jaGFuZ2UgPSBjaGFuZ2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZExpbmsgKGxpbmspIHtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5hZGRMaW5rKGxpbmspXHJcbiAgICAgICAgICAgICAgICAudGhlbihhZGRMaW5rUmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGFkZExpbmtFcnJvcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRMaW5rUmVzdWx0IChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubGluayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkTGlua0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZSAoKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0VXNlckxpbmtzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldExpbmtzUmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldExpbmtzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NSZXN1bHQgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi51c2VyTGlua3MgPSBjb21tb25TZXJ2aWNlLmNoZWNrRWRpdChyZXMuZGF0YS5saW5rcyk7XHJcbiAgICAgICAgICAgICAgICBnZXRUaXRsZShyZXMuZGF0YS5jb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NFcnJvciAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBnZXRUaXRsZSAoY291bnQpIHtcclxuICAgICAgICAgICAgc2VsZi50aXRsZSA9ICdNeSBsaW5rczonICsgY291bnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnRpdGxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoSW50ZXJjZXBvci4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiR3aW5kb3dcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcG9yJywgYXV0aEludGVyY2Vwb3IpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhJbnRlcmNlcG9yICgkcm9vdFNjb3BlLCAkd2luZG93KSB7XHJcbiAgICAgICAgdmFyIGF1dGhJbnRlcmNlcG9yID0ge1xyXG4gICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHJlc3BvbnNlLmhlYWRlcnMoJ3gtYWNjZXNzLXRva2VuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXNwb25zZS5oZWFkZXJzKCdpZCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJOYW1lID0gcmVzcG9uc2UuaGVhZGVycygndXNlck5hbWUnKTtcclxuICAgICAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLmNhbkxvZ2luKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZCkgeyAkd2luZG93LmxvY2FsU3RvcmFnZS5pZCA9IGlkOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyTmFtZSkgeyAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VyTmFtZSA9IHVzZXJOYW1lOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nZ2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gYXV0aEludGVyY2Vwb3I7XHJcblxyXG4gICAgfVxyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
