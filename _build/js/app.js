(function() {
    config.$inject = ["$httpProvider"];
    runBlock.$inject = ["$rootScope", "$window", "authService", "commonService"];
    angular
        .module('InBrief', [
            'ui.router',
            'Alertify',
            'ui.bootstrap',
            'ngCookies',
            'ngMessages'
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
        self.getPaginationSet = getPaginationSet;

        function getHost () {
            return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
        function checkEdit (links) {
            angular.forEach(links, function(value, key) {
                value.editable = $window.localStorage.id == value.userId && $rootScope.logged;
            });
            return links;

        }
        function getPaginationSet (page, perPage) {
            var defaultSet = {
                page: page ? page : 1,
                perPage: perPage ? perPage : 2
            };
            return {
                skip: (defaultSet.page - 1) * defaultSet.perPage,
                limit: defaultSet.perPage
            }

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
                'common/modals/templates/modalAuth.tmpl.html',
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
    LinkEditController.$inject = ["data", "$uibModalInstance", "linkService", "Alertify"];
    angular
        .module('InBrief')
        .controller('LinkEditController', LinkEditController);

    function LinkEditController (data, $uibModalInstance, linkService, Alertify) {
        var self = this;
        self.title = 'Edit link';
        self.linkToEdit = data;
        self.save = save;
        self.close = close;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function save (editedLink) {
            linkService.updateLink(editedLink)
                .then(function () {
                    Alertify.success('Link updated successfully');
                    close();
                })
                .catch(function () {
                    Alertify.error(err.data.message);
                });
        }
    }
}());
(function () {
    LinkDetailsController.$inject = ["data", "$uibModalInstance", "$state"];
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (data, $uibModalInstance, $state) {
        var self = this;
        self.title = 'Link details';
        self.editorEnabled = false;
        self.link = data.link;
        self.sum = data.sum;
        self.close = close;
        self.getLinksByTag = getLinksByTag;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function getLinksByTag (tag) {
            $state.go('tag', {tag: tag});
            self.close();
        }

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
                title: '=',
                delete: '&'
            }
        };
    }
}());
(function () {
    LinksTableController.$inject = ["modalService", "linkService", "Alertify"];
    angular
        .module('InBrief')
        .controller('LinksTableController', LinksTableController);

    function LinksTableController (modalService, linkService, Alertify) {
        var self = this;
        self.linkDetails = linkDetails;
        self.editLink = editLink;
        self.deleteLink = deleteLink;

        function linkDetails (linkId) {
            linkService
                .getLinkById(linkId)
                .then(getlinkDetailsSuccess)
                .catch(getlinkDetailsError);

            function getlinkDetailsSuccess (res) {
                var modalInstance = modalService.getModal(true,
                    'common/modals/templates/linkDetails.tmpl.html',
                    'LinkDetailsController',
                    'linkDetails',
                    res.data);
            }
            function getlinkDetailsError (err) {
                Alertify.error(err.data.message);
            }
        }

        function editLink (link) {
            var modalInstance = modalService.getModal(true,
                'common/modals/templates/linkEdit.tmpl.html',
                'LinkEditController',
                'linkEdit',
                link);
        }
        function deleteLink (linkId) {
            self.delete({linkId: linkId});
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
                link: '=',
                close: '&'

            }
        };
    }
}());
(function () {
    angular
        .module('InBrief')
        .controller('LinkFormController', LinkFormController);

    function LinkFormController () {
        var self = this;
        self.save = save;
        self.cancel = cancel;

        function save (link) {
            self.action({link: link});
        }
        function cancel (link) {
            self.link = null;
            self.close();
        }

    }
} ());
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
    'use strict';
    angular
        .module('InBrief')
        .directive('loginForm', loginForm);

    function loginForm () {
        return {
            restrict: 'E',
            templateUrl: 'common/auth/tmpl/login-form-tmpl.html',
            controller: 'LoginFormController',
            controllerAs: 'loginForm',
            bindToController: {
                close: '&',
                button: '=',
                submit: '&'
            }
        };
    }
}());
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
(function () {
    LoginFormController.$inject = ["authService", "Alertify", "$state", "$rootScope"];
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
            user.userName = self.user.userName;
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
        self.getLinkByTag = getLinkByTag;

        function getLinks (paginationSet) {
            return $http({
                method: 'GET',
                url: 'api/links',
                params: paginationSet
            });
        }

        function addLink (link) {
            return $http({
                method: 'POST',
                url: 'api/links',
                data: link
            });
        }

        function getUserLinks (paginationSet) {
            return $http({
                method: 'GET',
                url: 'api/userLinks',
                params: paginationSet
            });
        }
        function getLinkById (linkId) {
            return $http({
                method: 'GET',
                url: 'api/links/' + linkId
            });
        }
        function updateLink (editedLink) {
            return $http({
                method: 'PUT',
                url: 'api/links',
                data: editedLink
            });
        }
        function deleteLink (linkId) {
            return $http({
                method: 'DELETE',
                url: 'api/links/' + linkId
            });
        }
        function getLinkByTag (tag, paginationSet) {
            return $http({
                method: 'GET',
                url: 'api/linksByTag/' + tag,
                params: paginationSet
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
        getLinkByTag.$inject = ["$stateParams", "commonService", "Alertify", "linkService"];
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
            .state('tag', {
                url: '/tag/:tag',
                templateUrl: 'links/views/linksByTag.html',
                controller: 'LinksByTagController',
                controllerAs: 'linksByTag',
                resolve: {
                    resolvedByTag: getLinkByTag
                }
            });

        function getLinks (linkService, Alertify, commonService) {
            return linkService
                .getLinks(commonService.getPaginationSet())
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
        function getLinkByTag ($stateParams, commonService, Alertify, linkService) {
            console.log('$stateparams', $stateParams.tag);
            return linkService
                .getLinkByTag($stateParams.tag, commonService.getPaginationSet())
                .then(function (res) {
                    return {
                        links: res.data.links,
                        count: res.data.count
                    };
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });

        }


    }
} ());
(function () {
    LinksController.$inject = ["linkService", "resolvedLinks", "Alertify", "commonService"];
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService, resolvedLinks, Alertify, commonService) {
        var self = this;
        self.title = 'All links: ' + resolvedLinks.count;
        self.links = resolvedLinks.links;
        self.count = resolvedLinks.count;
        self.currentPage = 1;
        self.itemsPerPage = 2;
        self.pageChanged = pageChanged;

        function pageChanged () {
            linkService
                .getLinks(commonService.getPaginationSet(self.currentPage, self.itemsPerPage))
                .then(getLinksSuccess)
                .catch(getLinksError);

            function getLinksSuccess (res) {
                self.links = res.data.links;
            }
            function getLinksError () {
                Alertify.error(err.data.message);
            }
        }
    }
}());
(function () {
    LinksByTagController.$inject = ["linkService", "Alertify", "commonService", "resolvedByTag", "$stateParams"];
    angular
        .module('InBrief')
        .controller('LinksByTagController', LinksByTagController);

    function LinksByTagController (linkService, Alertify, commonService, resolvedByTag, $stateParams) {
        var self = this;
        self.title = 'We have ' + resolvedByTag.count + ' links with tag: ' + $stateParams.tag;
        self.links = resolvedByTag.links;
        self.count = resolvedByTag.count;
        self.currentPage = 1;
        self.itemsPerPage = 2;
        self.pageChanged = pageChanged;

        function pageChanged () {
            linkService
                .getLinks(commonService.getPaginationSet(self.currentPage, self.itemsPerPage))
                .then(getLinksSuccess)
                .catch(getLinksError);

            function getLinksSuccess (res) {
                self.links = res.data.links;
            }
            function getLinksError () {
                Alertify.error(err.data.message);
            }
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
                .getUserLinks(commonService.getPaginationSet())
                .then(function (res) {
                    commonService.checkEdit(res.data.links);
                    return res.data;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }
    }
} ());
(function () {
    HomeController.$inject = ["resolvedUserLinks", "Alertify", "linkService", "commonService"];
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController (resolvedUserLinks, Alertify, linkService, commonService) {
        var self = this;
        self.currentPage = 1;
        self.itemsPerPage = 2;
        self.count = resolvedUserLinks.count;
        self.title = getTitle(resolvedUserLinks.count);
        self.addLink = addLink;
        self.userLinks = resolvedUserLinks.links;
        self.pageChanged = pageChanged;
        self.deleteLink = deleteLink;

        function addLink (link) {
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);

            function addLinkResult (res) {
                self.link = null;
                self.pageChanged();
                Alertify.success('Link added successfully');
            }
            function addLinkError (err) {
                Alertify.error(err.data.message);
            }
        }
        function pageChanged () {
            linkService
                .getUserLinks(commonService.getPaginationSet(self.currentPage, self.itemsPerPage))
                .then(getLinksResult)
                .catch(getLinksError);

            function getLinksResult (res) {
                self.userLinks = commonService.checkEdit(res.data.links);
                self.count = res.data.count;
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
        function deleteLink (linkId) {
            Alertify
                .confirm('Do you want to delete this link?')
                .then(positiveAnsver);

            function positiveAnsver () {
                linkService.deleteLink(linkId)
                    .then(function () {
                        Alertify.success('Link removed successfully');
                        pageChanged();
                    })
                    .catch(function (err) {
                        Alertify.error(err.data.message);
                    });
            }

        }
    }
}());
(function() {
    authIntercepor.$inject = ["$rootScope", "$window", "$cookies"];
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor ($rootScope, $window, $cookies) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9tb2RhbC5zZXJ2aWNlL21vZGFsLnNlcnZpY2UuanMiLCJjb21tb24vc2VydmljZXMvY29tbW9uU2VydmljZS9jb21tb25TZXJ2aWNlLmpzIiwiY29tbW9uL25hdkJhci9kaXJlY3RpdmUvbmF2QmFyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9tb2RhbHMvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9tb2RhbHMvY29udHJvbGxlcnMvTGlua0VkaXRDb250cm9sbGVyLmpzIiwiY29tbW9uL21vZGFscy9jb250cm9sbGVycy9MaW5rRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb21tb24vbGlua3NUYWJsZS9kaXJlY3RpdmUvbGlua3NUYWJsZS5kaXJlY3RpdmUuanMiLCJjb21tb24vbGlua3NUYWJsZS9jb250cm9sbGVyL0xpbmtzVGFibGVDb250cm9sbGVyLmpzIiwiY29tbW9uL2xpbmtGb3JtL2RpcmVjdGl2ZS9saW5rRm9ybS5kaXJlY3RpdmUuanMiLCJjb21tb24vbGlua0Zvcm0vY29udHJvbGxlcnMvTGlua0Zvcm1Db250cm9sbGVyLmpzIiwiY29tbW9uL2F1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmpzIiwiY29tbW9uL2F1dGgvZGlyZWN0aXZlcy9sb2dpbkZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvZGlyZWN0aXZlcy9hdXRoRm9ybS5kaXJlY3RpdmUuanMiLCJjb21tb24vYXV0aC9jb250cm9sbGVycy9Mb2dpbkZvcm1Db250cm9sbGVyLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvc2VydmljZXMvbGlua3Muc2VydmljZS5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0NvbnRyb2xsZXIuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0J5VGFnQ29udHJvbGxlci5qcyIsImhvbWUvcm91dGVzL3JvdXRlcy5qcyIsImhvbWUvY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJpbnRlcmNlcHRvcnMvYXV0aEludGVyY2VwdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJGh0dHBQcm92aWRlclwiXTtcclxuICAgIHJ1bkJsb2NrLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwiJHdpbmRvd1wiLCBcImF1dGhTZXJ2aWNlXCIsIFwiY29tbW9uU2VydmljZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJywgW1xyXG4gICAgICAgICAgICAndWkucm91dGVyJyxcclxuICAgICAgICAgICAgJ0FsZXJ0aWZ5JyxcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAgICAgICAgICduZ0Nvb2tpZXMnLFxyXG4gICAgICAgICAgICAnbmdNZXNzYWdlcydcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5ydW4ocnVuQmxvY2spO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJGh0dHBQcm92aWRlcikge1xyXG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcG9yJyk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBydW5CbG9jayAoJHJvb3RTY29wZSwgJHdpbmRvdywgYXV0aFNlcnZpY2UsIGNvbW1vblNlcnZpY2UpIHtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGxvZ291dFByb2Nlc3MpO1xyXG4gICAgICAgICRyb290U2NvcGUuaG9zdCA9IGNvbW1vblNlcnZpY2UuZ2V0SG9zdCgpO1xyXG5cclxuICAgICAgICBpZiAoJHdpbmRvdy5sb2NhbFN0b3JhZ2UudG9rZW4pIHtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZGVmYXVsdFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW5Mb2dpbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTs7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FuTG9naW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIG1vZGFsU2VydmljZS4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdtb2RhbFNlcnZpY2UnLCBtb2RhbFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vZGFsU2VydmljZSgkdWliTW9kYWwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRNb2RhbCA9IGdldE1vZGFsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb2RhbCAoYW5pbWF0aW9uc0VuYWJsZWQsIHBhdGhUb1RtcGwsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJBcywgZGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb25zRW5hYmxlZCxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBwYXRoVG9UbXBsLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogY29udHJvbGxlckFzLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIGNvbW1vblNlcnZpY2UuJGluamVjdCA9IFtcIiRsb2NhdGlvblwiLCBcIiR3aW5kb3dcIiwgXCIkcm9vdFNjb3BlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdjb21tb25TZXJ2aWNlJywgY29tbW9uU2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29tbW9uU2VydmljZSgkbG9jYXRpb24sICR3aW5kb3csICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRIb3N0ID0gZ2V0SG9zdDtcclxuICAgICAgICBzZWxmLmNoZWNrRWRpdCA9IGNoZWNrRWRpdDtcclxuICAgICAgICBzZWxmLmdldFBhZ2luYXRpb25TZXQgPSBnZXRQYWdpbmF0aW9uU2V0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRIb3N0ICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi5wcm90b2NvbCgpICsgJzovLycgKyAkbG9jYXRpb24uaG9zdCgpICsgJzonICsgJGxvY2F0aW9uLnBvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tFZGl0IChsaW5rcykge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlua3MsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLmVkaXRhYmxlID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2UuaWQgPT0gdmFsdWUudXNlcklkICYmICRyb290U2NvcGUubG9nZ2VkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtzO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGFnaW5hdGlvblNldCAocGFnZSwgcGVyUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgZGVmYXVsdFNldCA9IHtcclxuICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2UgPyBwYWdlIDogMSxcclxuICAgICAgICAgICAgICAgIHBlclBhZ2U6IHBlclBhZ2UgPyBwZXJQYWdlIDogMlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2tpcDogKGRlZmF1bHRTZXQucGFnZSAtIDEpICogZGVmYXVsdFNldC5wZXJQYWdlLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IGRlZmF1bHRTZXQucGVyUGFnZVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ25hdkJhcicsIG5hdkJhckZuKTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZCYXJGbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vbmF2QmFyL3ZpZXdzL25hdi1iYXItdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdkJhckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICduYXZCYXInXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTmF2QmFyQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIm1vZGFsU2VydmljZVwiLCBcIiRzdGF0ZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTmF2QmFyQ29udHJvbGxlcicsIE5hdkJhckNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE5hdkJhckNvbnRyb2xsZXIgKCRyb290U2NvcGUsIG1vZGFsU2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYub3BlbiA9IG9wZW47XHJcbiAgICAgICAgc2VsZi5sb2dvdXQgPSBsb2dvdXQ7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW4gKCkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9IG1vZGFsU2VydmljZS5nZXRNb2RhbCh0cnVlLFxyXG4gICAgICAgICAgICAgICAgJ2NvbW1vbi9tb2RhbHMvdGVtcGxhdGVzL21vZGFsQXV0aC50bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgJ01vZGFsQXV0aENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgJ21vZGFsQXV0aCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsQXV0aENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNb2RhbEF1dGhDb250cm9sbGVyJywgTW9kYWxBdXRoQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTW9kYWxBdXRoQ29udHJvbGxlciAoJHVpYk1vZGFsSW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtFZGl0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiZGF0YVwiLCBcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua0VkaXRDb250cm9sbGVyJywgTGlua0VkaXRDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rRWRpdENvbnRyb2xsZXIgKGRhdGEsICR1aWJNb2RhbEluc3RhbmNlLCBsaW5rU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdFZGl0IGxpbmsnO1xyXG4gICAgICAgIHNlbGYubGlua1RvRWRpdCA9IGRhdGE7XHJcbiAgICAgICAgc2VsZi5zYXZlID0gc2F2ZTtcclxuICAgICAgICBzZWxmLmNsb3NlID0gY2xvc2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUgKGVkaXRlZExpbmspIHtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2UudXBkYXRlTGluayhlZGl0ZWRMaW5rKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MoJ0xpbmsgdXBkYXRlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtEZXRhaWxzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiZGF0YVwiLCBcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwiJHN0YXRlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rRGV0YWlsc0NvbnRyb2xsZXInLCBMaW5rRGV0YWlsc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtEZXRhaWxzQ29udHJvbGxlciAoZGF0YSwgJHVpYk1vZGFsSW5zdGFuY2UsICRzdGF0ZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0xpbmsgZGV0YWlscyc7XHJcbiAgICAgICAgc2VsZi5lZGl0b3JFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgc2VsZi5saW5rID0gZGF0YS5saW5rO1xyXG4gICAgICAgIHNlbGYuc3VtID0gZGF0YS5zdW07XHJcbiAgICAgICAgc2VsZi5jbG9zZSA9IGNsb3NlO1xyXG4gICAgICAgIHNlbGYuZ2V0TGlua3NCeVRhZyA9IGdldExpbmtzQnlUYWc7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzQnlUYWcgKHRhZykge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3RhZycsIHt0YWc6IHRhZ30pO1xyXG4gICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xpbmtzVGFibGUnLCBsaW5rc1RhYmxlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaW5rc1RhYmxlICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9saW5rc1RhYmxlL3RlbXBsYXRlL2xpbmtzVGFibGUtdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpbmtzVGFibGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3NUYWJsZUN0cmwnLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB7XHJcbiAgICAgICAgICAgICAgICBsaW5rczogJz0nLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsczogJyYnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICc9JyxcclxuICAgICAgICAgICAgICAgIGRlbGV0ZTogJyYnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBMaW5rc1RhYmxlQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibW9kYWxTZXJ2aWNlXCIsIFwibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua3NUYWJsZUNvbnRyb2xsZXInLCBMaW5rc1RhYmxlQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NUYWJsZUNvbnRyb2xsZXIgKG1vZGFsU2VydmljZSwgbGlua1NlcnZpY2UsIEFsZXJ0aWZ5KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubGlua0RldGFpbHMgPSBsaW5rRGV0YWlscztcclxuICAgICAgICBzZWxmLmVkaXRMaW5rID0gZWRpdExpbms7XHJcbiAgICAgICAgc2VsZi5kZWxldGVMaW5rID0gZGVsZXRlTGluaztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGlua0RldGFpbHMgKGxpbmtJZCkge1xyXG4gICAgICAgICAgICBsaW5rU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmdldExpbmtCeUlkKGxpbmtJZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldGxpbmtEZXRhaWxzU3VjY2VzcylcclxuICAgICAgICAgICAgICAgIC5jYXRjaChnZXRsaW5rRGV0YWlsc0Vycm9yKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldGxpbmtEZXRhaWxzU3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9IG1vZGFsU2VydmljZS5nZXRNb2RhbCh0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb21tb24vbW9kYWxzL3RlbXBsYXRlcy9saW5rRGV0YWlscy50bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICdMaW5rRGV0YWlsc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICdsaW5rRGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldGxpbmtEZXRhaWxzRXJyb3IgKGVycikge1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVkaXRMaW5rIChsaW5rKSB7XHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gbW9kYWxTZXJ2aWNlLmdldE1vZGFsKHRydWUsXHJcbiAgICAgICAgICAgICAgICAnY29tbW9uL21vZGFscy90ZW1wbGF0ZXMvbGlua0VkaXQudG1wbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICdMaW5rRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgJ2xpbmtFZGl0JyxcclxuICAgICAgICAgICAgICAgIGxpbmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWxldGVMaW5rIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgc2VsZi5kZWxldGUoe2xpbmtJZDogbGlua0lkfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xpbmtGb3JtJywgbGlua0Zvcm0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtGb3JtICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9saW5rRm9ybS90ZW1wbGF0ZS9saW5rRm9ybS10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua0Zvcm1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua0Zvcm1DdHJsJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnJicsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiAnPScsXHJcbiAgICAgICAgICAgICAgICBjbG9zZTogJyYnXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rRm9ybUNvbnRyb2xsZXInLCBMaW5rRm9ybUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtGb3JtQ29udHJvbGxlciAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuc2F2ZSA9IHNhdmU7XHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBjYW5jZWw7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUgKGxpbmspIHtcclxuICAgICAgICAgICAgc2VsZi5hY3Rpb24oe2xpbms6IGxpbmt9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsIChsaW5rKSB7XHJcbiAgICAgICAgICAgIHNlbGYubGluayA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwVXNlciA9IHNpZ251cFVzZXI7XHJcbiAgICAgICAgc2VsZi5kZWZhdWx0UmVxdWVzdCA9IGRlZmF1bHRSZXF1ZXN0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3NpZ251cCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWZhdWx0UmVxdWVzdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbG9naW5Gb3JtJywgbG9naW5Gb3JtKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb2dpbkZvcm0gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2F1dGgvdG1wbC9sb2dpbi1mb3JtLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkZvcm1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbG9naW5Gb3JtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgY2xvc2U6ICcmJyxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbjogJz0nLFxyXG4gICAgICAgICAgICAgICAgc3VibWl0OiAnJidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdhdXRoRm9ybScsIGF1dGhGb3JtKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoRm9ybSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYXV0aC90bXBsL2F1dGgtZm9ybS10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQXV0aEZvcm1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYXV0aGZvcm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZTogJyYnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBMb2dpbkZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCIsIFwiJHN0YXRlXCIsIFwiJHJvb3RTY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTG9naW5Gb3JtQ29udHJvbGxlcicsIExvZ2luRm9ybUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExvZ2luRm9ybUNvbnRyb2xsZXIgKGF1dGhTZXJ2aWNlLCBBbGVydGlmeSwgJHN0YXRlLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuc2F2ZSA9IHNhdmU7XHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBjYW5jZWw7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUgKHVzZXIpIHtcclxuICAgICAgICAgICAgc2VsZi5zdWJtaXQoe3VzZXI6IHVzZXJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsICgpIHtcclxuICAgICAgICAgICAgc2VsZi51c2VyID0gbnVsbDtcclxuICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIEF1dGhGb3JtQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiYXV0aFNlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcIiRzdGF0ZVwiLCBcIiRyb290U2NvcGVcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhGb3JtQ29udHJvbGxlcicsIEF1dGhGb3JtQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gQXV0aEZvcm1Db250cm9sbGVyIChhdXRoU2VydmljZSwgQWxlcnRpZnksICRzdGF0ZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxvZ2luVGFiID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLmxvZ2luID0gbG9naW47XHJcbiAgICAgICAgc2VsZi5zaWdudXAgPSBzaWdudXA7XHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBjYW5jZWw7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luICh1c2VyKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FuTG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmxvZ2luVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4obG9naW5TdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2dpblN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaWdudXAgKHVzZXIpIHtcclxuICAgICAgICAgICAgdXNlci51c2VyTmFtZSA9IHNlbGYudXNlci51c2VyTmFtZTtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UuXHJcbiAgICAgICAgICAgICAgICBzaWdudXBVc2VyKHVzZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzaWduVXBTdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzaWduVXBTdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcygnTG9nIGluLCBwbGVhc2UnKTtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi51c2VyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsICgpIHtcclxuICAgICAgICAgICAgc2VsZi51c2VyID0gbnVsbDtcclxuICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBlcnJvckhhbmRsZXIgKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyLmRhdGEuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZXJyLmRhdGEuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnIuZGF0YS5lcnJvcnMuaGFzT3duUHJvcGVydHkoa2V5KSkgeyBjb250aW51ZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEuZXJyb3JzW2tleV0ubWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgbGlua1NlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdsaW5rU2VydmljZScsIGxpbmtTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaW5rU2VydmljZSgkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmdldExpbmtzID0gZ2V0TGlua3M7XHJcbiAgICAgICAgc2VsZi5hZGRMaW5rID0gYWRkTGluaztcclxuICAgICAgICBzZWxmLmdldFVzZXJMaW5rcyA9IGdldFVzZXJMaW5rcztcclxuICAgICAgICBzZWxmLmdldExpbmtCeUlkID0gZ2V0TGlua0J5SWQ7XHJcbiAgICAgICAgc2VsZi51cGRhdGVMaW5rID0gdXBkYXRlTGluaztcclxuICAgICAgICBzZWxmLmRlbGV0ZUxpbmsgPSBkZWxldGVMaW5rO1xyXG4gICAgICAgIHNlbGYuZ2V0TGlua0J5VGFnID0gZ2V0TGlua0J5VGFnO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRMaW5rcyAocGFnaW5hdGlvblNldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rcycsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhZ2luYXRpb25TZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRMaW5rIChsaW5rKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rcycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBsaW5rXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VXNlckxpbmtzIChwYWdpbmF0aW9uU2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3VzZXJMaW5rcycsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhZ2luYXRpb25TZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtCeUlkIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MvJyArIGxpbmtJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTGluayAoZWRpdGVkTGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rcycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBlZGl0ZWRMaW5rXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWxldGVMaW5rIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MvJyArIGxpbmtJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlua0J5VGFnICh0YWcsIHBhZ2luYXRpb25TZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3NCeVRhZy8nICsgdGFnLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYWdpbmF0aW9uU2V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICBnZXRMaW5rcy4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcImNvbW1vblNlcnZpY2VcIl07XHJcbiAgICAgICAgZ2V0TGlua0J5VGFnLiRpbmplY3QgPSBbXCIkc3RhdGVQYXJhbXNcIiwgXCJjb21tb25TZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIiwgXCJsaW5rU2VydmljZVwiXTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJHN0YXRlUHJvdmlkZXInLCAkc3RhdGVQcm92aWRlcik7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9saW5rcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpc3RMaW5rcy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZExpbmtzOiBnZXRMaW5rc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ3RhZycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy90YWcvOnRhZycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpbmtzQnlUYWcuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua3NCeVRhZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3NCeVRhZycsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRCeVRhZzogZ2V0TGlua0J5VGFnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRMaW5rcyAobGlua1NlcnZpY2UsIEFsZXJ0aWZ5LCBjb21tb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsaW5rU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmdldExpbmtzKGNvbW1vblNlcnZpY2UuZ2V0UGFnaW5hdGlvblNldCgpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtzOiBjb21tb25TZXJ2aWNlLmNoZWNrRWRpdChyZXMuZGF0YS5saW5rcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiByZXMuZGF0YS5jb3VudFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtCeVRhZyAoJHN0YXRlUGFyYW1zLCBjb21tb25TZXJ2aWNlLCBBbGVydGlmeSwgbGlua1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyRzdGF0ZXBhcmFtcycsICRzdGF0ZVBhcmFtcy50YWcpO1xyXG4gICAgICAgICAgICByZXR1cm4gbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRMaW5rQnlUYWcoJHN0YXRlUGFyYW1zLnRhZywgY29tbW9uU2VydmljZS5nZXRQYWdpbmF0aW9uU2V0KCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3M6IHJlcy5kYXRhLmxpbmtzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogcmVzLmRhdGEuY291bnRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoJ0Vycm9yIGdldHRpbmcgbGlua3MnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJyZXNvbHZlZExpbmtzXCIsIFwiQWxlcnRpZnlcIiwgXCJjb21tb25TZXJ2aWNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rc0NvbnRyb2xsZXInLCBMaW5rc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtzQ29udHJvbGxlciAobGlua1NlcnZpY2UsIHJlc29sdmVkTGlua3MsIEFsZXJ0aWZ5LCBjb21tb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYudGl0bGUgPSAnQWxsIGxpbmtzOiAnICsgcmVzb2x2ZWRMaW5rcy5jb3VudDtcclxuICAgICAgICBzZWxmLmxpbmtzID0gcmVzb2x2ZWRMaW5rcy5saW5rcztcclxuICAgICAgICBzZWxmLmNvdW50ID0gcmVzb2x2ZWRMaW5rcy5jb3VudDtcclxuICAgICAgICBzZWxmLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICBzZWxmLml0ZW1zUGVyUGFnZSA9IDI7XHJcbiAgICAgICAgc2VsZi5wYWdlQ2hhbmdlZCA9IHBhZ2VDaGFuZ2VkO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYWdlQ2hhbmdlZCAoKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua3MoY29tbW9uU2VydmljZS5nZXRQYWdpbmF0aW9uU2V0KHNlbGYuY3VycmVudFBhZ2UsIHNlbGYuaXRlbXNQZXJQYWdlKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldExpbmtzU3VjY2VzcylcclxuICAgICAgICAgICAgICAgIC5jYXRjaChnZXRMaW5rc0Vycm9yKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldExpbmtzU3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmxpbmtzID0gcmVzLmRhdGEubGlua3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NFcnJvciAoKSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTGlua3NCeVRhZ0NvbnRyb2xsZXIuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIiwgXCJjb21tb25TZXJ2aWNlXCIsIFwicmVzb2x2ZWRCeVRhZ1wiLCBcIiRzdGF0ZVBhcmFtc1wiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua3NCeVRhZ0NvbnRyb2xsZXInLCBMaW5rc0J5VGFnQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NCeVRhZ0NvbnRyb2xsZXIgKGxpbmtTZXJ2aWNlLCBBbGVydGlmeSwgY29tbW9uU2VydmljZSwgcmVzb2x2ZWRCeVRhZywgJHN0YXRlUGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYudGl0bGUgPSAnV2UgaGF2ZSAnICsgcmVzb2x2ZWRCeVRhZy5jb3VudCArICcgbGlua3Mgd2l0aCB0YWc6ICcgKyAkc3RhdGVQYXJhbXMudGFnO1xyXG4gICAgICAgIHNlbGYubGlua3MgPSByZXNvbHZlZEJ5VGFnLmxpbmtzO1xyXG4gICAgICAgIHNlbGYuY291bnQgPSByZXNvbHZlZEJ5VGFnLmNvdW50O1xyXG4gICAgICAgIHNlbGYuY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAgIHNlbGYuaXRlbXNQZXJQYWdlID0gMjtcclxuICAgICAgICBzZWxmLnBhZ2VDaGFuZ2VkID0gcGFnZUNoYW5nZWQ7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBhZ2VDaGFuZ2VkICgpIHtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRMaW5rcyhjb21tb25TZXJ2aWNlLmdldFBhZ2luYXRpb25TZXQoc2VsZi5jdXJyZW50UGFnZSwgc2VsZi5pdGVtc1BlclBhZ2UpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZ2V0TGlua3NTdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldExpbmtzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NTdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubGlua3MgPSByZXMuZGF0YS5saW5rcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMaW5rc0Vycm9yICgpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJHVybFJvdXRlclByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgICBnZXRVc2VyTGlua3MuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIiwgXCJjb21tb25TZXJ2aWNlXCJdO1xyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ2hvbWUnKTtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2hvbWUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lL3ZpZXdzL21haW4uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnaG9tZScsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRVc2VyTGlua3M6IGdldFVzZXJMaW5rc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VXNlckxpbmtzIChsaW5rU2VydmljZSwgQWxlcnRpZnksIGNvbW1vblNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0VXNlckxpbmtzKGNvbW1vblNlcnZpY2UuZ2V0UGFnaW5hdGlvblNldCgpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vblNlcnZpY2UuY2hlY2tFZGl0KHJlcy5kYXRhLmxpbmtzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgSG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcInJlc29sdmVkVXNlckxpbmtzXCIsIFwiQWxlcnRpZnlcIiwgXCJsaW5rU2VydmljZVwiLCBcImNvbW1vblNlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyIChyZXNvbHZlZFVzZXJMaW5rcywgQWxlcnRpZnksIGxpbmtTZXJ2aWNlLCBjb21tb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAgIHNlbGYuaXRlbXNQZXJQYWdlID0gMjtcclxuICAgICAgICBzZWxmLmNvdW50ID0gcmVzb2x2ZWRVc2VyTGlua3MuY291bnQ7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9IGdldFRpdGxlKHJlc29sdmVkVXNlckxpbmtzLmNvdW50KTtcclxuICAgICAgICBzZWxmLmFkZExpbmsgPSBhZGRMaW5rO1xyXG4gICAgICAgIHNlbGYudXNlckxpbmtzID0gcmVzb2x2ZWRVc2VyTGlua3MubGlua3M7XHJcbiAgICAgICAgc2VsZi5wYWdlQ2hhbmdlZCA9IHBhZ2VDaGFuZ2VkO1xyXG4gICAgICAgIHNlbGYuZGVsZXRlTGluayA9IGRlbGV0ZUxpbms7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZExpbmsgKGxpbmspIHtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5hZGRMaW5rKGxpbmspXHJcbiAgICAgICAgICAgICAgICAudGhlbihhZGRMaW5rUmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGFkZExpbmtFcnJvcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRMaW5rUmVzdWx0IChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubGluayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBhZ2VDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKCdMaW5rIGFkZGVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZExpbmtFcnJvciAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBwYWdlQ2hhbmdlZCAoKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0VXNlckxpbmtzKGNvbW1vblNlcnZpY2UuZ2V0UGFnaW5hdGlvblNldChzZWxmLmN1cnJlbnRQYWdlLCBzZWxmLml0ZW1zUGVyUGFnZSkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihnZXRMaW5rc1Jlc3VsdClcclxuICAgICAgICAgICAgICAgIC5jYXRjaChnZXRMaW5rc0Vycm9yKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldExpbmtzUmVzdWx0IChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudXNlckxpbmtzID0gY29tbW9uU2VydmljZS5jaGVja0VkaXQocmVzLmRhdGEubGlua3MpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jb3VudCA9IHJlcy5kYXRhLmNvdW50O1xyXG4gICAgICAgICAgICAgICAgZ2V0VGl0bGUocmVzLmRhdGEuY291bnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldExpbmtzRXJyb3IgKGVycikge1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGl0bGUgKGNvdW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYudGl0bGUgPSAnTXkgbGlua3M6JyArIGNvdW50O1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi50aXRsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlTGluayAobGlua0lkKSB7XHJcbiAgICAgICAgICAgIEFsZXJ0aWZ5XHJcbiAgICAgICAgICAgICAgICAuY29uZmlybSgnRG8geW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgbGluaz8nKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocG9zaXRpdmVBbnN2ZXIpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gcG9zaXRpdmVBbnN2ZXIgKCkge1xyXG4gICAgICAgICAgICAgICAgbGlua1NlcnZpY2UuZGVsZXRlTGluayhsaW5rSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKCdMaW5rIHJlbW92ZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYXV0aEludGVyY2Vwb3IuJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCIkd2luZG93XCIsIFwiJGNvb2tpZXNcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcG9yJywgYXV0aEludGVyY2Vwb3IpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhJbnRlcmNlcG9yICgkcm9vdFNjb3BlLCAkd2luZG93LCAkY29va2llcykge1xyXG4gICAgICAgIHZhciBhdXRoSW50ZXJjZXBvciA9IHtcclxuICAgICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10gPSAkd2luZG93LmxvY2FsU3RvcmFnZS50b2tlbjtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dvdXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzcG9uc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSByZXNwb25zZS5oZWFkZXJzKCd4LWFjY2Vzcy10b2tlbicpLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gcmVzcG9uc2UuaGVhZGVycygnaWQnKSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyTmFtZSA9IHJlc3BvbnNlLmhlYWRlcnMoJ3VzZXJOYW1lJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS5jYW5Mb2dpbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ2lkJywgaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQpIHsgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuaWQgPSBpZDsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlck5hbWUpIHsgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ2dlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGF1dGhJbnRlcmNlcG9yO1xyXG5cclxuICAgIH1cclxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
