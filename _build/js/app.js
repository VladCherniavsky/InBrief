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
    LinkEditController.$inject = ["data", "$uibModalInstance", "linkService", "Alertify"];
    angular
        .module('InBrief')
        .controller('LinkEditController', LinkEditController);

    function LinkEditController (data, $uibModalInstance, linkService, Alertify) {
        console.log('link', data);
        var self = this;
        self.title = 'Edit link';
        self.linkToEdit = data;
        self.save = save;
        self.close = close;

        function close () {
            $uibModalInstance.dismiss('cancel');
        }
        function save (editedLink) {
            console.log('editedLink)', editedLink);
            linkService.updateLink(editedLink)
                .then(function (res) {
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
            $state.go('tag', {tag: tag})
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

        function editLink (link) {
            var modalInstance = modalService.getModal(true,
                'common/modals.tmpl/templates/linkEdit.tmpl.html',
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
        function getLinkByTag (tag, paginationSet) {
            console.log('tag', tag);
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
        console.log('getLinkByTag',resolvedByTag);
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
                console.log(res.data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9tb2RhbC5zZXJ2aWNlL21vZGFsLnNlcnZpY2UuanMiLCJjb21tb24vc2VydmljZXMvY29tbW9uU2VydmljZS9jb21tb25TZXJ2aWNlLmpzIiwiY29tbW9uL25hdkJhci9kaXJlY3RpdmUvbmF2QmFyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9tb2RhbHMudG1wbC9jb250cm9sbGVycy9Nb2RhbEF1dGhDb250cm9sbGVyLmpzIiwiY29tbW9uL21vZGFscy50bXBsL2NvbnRyb2xsZXJzL0xpbmtFZGl0Q29udHJvbGxlci5qcyIsImNvbW1vbi9tb2RhbHMudG1wbC9jb250cm9sbGVycy9MaW5rRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb21tb24vbGlua3NUYWJsZS9kaXJlY3RpdmUvbGlua3NUYWJsZS5kaXJlY3RpdmUuanMiLCJjb21tb24vbGlua3NUYWJsZS9jb250cm9sbGVyL0xpbmtzVGFibGVDb250cm9sbGVyLmpzIiwiY29tbW9uL2xpbmtGb3JtL2RpcmVjdGl2ZS9saW5rRm9ybS5kaXJlY3RpdmUuanMiLCJjb21tb24vbGlua0Zvcm0vY29udHJvbGxlcnMvTGlua0Zvcm1Db250cm9sbGVyLmpzIiwiY29tbW9uL2F1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmpzIiwiY29tbW9uL2F1dGgvZGlyZWN0aXZlcy9hdXRoRm9ybS5kaXJlY3RpdmUuanMiLCJjb21tb24vYXV0aC9jb250cm9sbGVycy9hdXRoRm9ybUNvbnRyb2xsZXIuanMiLCJsaW5rcy9zZXJ2aWNlcy9saW5rcy5zZXJ2aWNlLmpzIiwibGlua3Mvcm91dGVzL3JvdXRlcy5qcyIsImxpbmtzL2NvbnRyb2xsZXJzL0xpbmtzQ29udHJvbGxlci5qcyIsImxpbmtzL2NvbnRyb2xsZXJzL0xpbmtzQnlUYWdDb250cm9sbGVyLmpzIiwiaG9tZS9yb3V0ZXMvcm91dGVzLmpzIiwiaG9tZS9jb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcyIsImludGVyY2VwdG9ycy9hdXRoSW50ZXJjZXB0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJGh0dHBQcm92aWRlclwiXTtcclxuICAgIHJ1bkJsb2NrLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwiJHdpbmRvd1wiLCBcImF1dGhTZXJ2aWNlXCIsIFwiY29tbW9uU2VydmljZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJywgW1xyXG4gICAgICAgICAgICAndWkucm91dGVyJyxcclxuICAgICAgICAgICAgJ0FsZXJ0aWZ5JyxcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAgICAgICAgICduZ0Nvb2tpZXMnXHJcbiAgICAgICAgXSlcclxuICAgICAgICAuY29uZmlnKGNvbmZpZylcclxuICAgICAgICAucnVuKHJ1bkJsb2NrKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRodHRwUHJvdmlkZXIpIHtcclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXBvcicpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcnVuQmxvY2sgKCRyb290U2NvcGUsICR3aW5kb3csIGF1dGhTZXJ2aWNlLCBjb21tb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZCcsIGxvZ2dlZFByb2Nlc3MpO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dvdXQnLCBsb2dvdXRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLmhvc3QgPSBjb21tb25TZXJ2aWNlLmdldEhvc3QoKTtcclxuXHJcbiAgICAgICAgaWYgKCR3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmRlZmF1bHRSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FuTG9naW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7O1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbkxvZ2luID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnbW9kYWxTZXJ2aWNlJywgbW9kYWxTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb2RhbFNlcnZpY2UoJHVpYk1vZGFsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZ2V0TW9kYWwgPSBnZXRNb2RhbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9kYWwgKGFuaW1hdGlvbnNFbmFibGVkLCBwYXRoVG9UbXBsLCBjb250cm9sbGVyLCBjb250cm9sbGVyQXMsIGRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uc0VuYWJsZWQsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcGF0aFRvVG1wbCxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IGNvbnRyb2xsZXJBcyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBjb21tb25TZXJ2aWNlLiRpbmplY3QgPSBbXCIkbG9jYXRpb25cIiwgXCIkd2luZG93XCIsIFwiJHJvb3RTY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnY29tbW9uU2VydmljZScsIGNvbW1vblNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbW1vblNlcnZpY2UoJGxvY2F0aW9uLCAkd2luZG93LCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZ2V0SG9zdCA9IGdldEhvc3Q7XHJcbiAgICAgICAgc2VsZi5jaGVja0VkaXQgPSBjaGVja0VkaXQ7XHJcbiAgICAgICAgc2VsZi5nZXRQYWdpbmF0aW9uU2V0ID0gZ2V0UGFnaW5hdGlvblNldDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SG9zdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkbG9jYXRpb24ucHJvdG9jb2woKSArICc6Ly8nICsgJGxvY2F0aW9uLmhvc3QoKSArICc6JyArICRsb2NhdGlvbi5wb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrRWRpdCAobGlua3MpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpbmtzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5lZGl0YWJsZSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmlkID09IHZhbHVlLnVzZXJJZCAmJiAkcm9vdFNjb3BlLmxvZ2dlZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsaW5rcztcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBhZ2luYXRpb25TZXQgKHBhZ2UsIHBlclBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmF1bHRTZXQgPSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlOiBwYWdlID8gcGFnZSA6IDEsXHJcbiAgICAgICAgICAgICAgICBwZXJQYWdlOiBwZXJQYWdlID8gcGVyUGFnZSA6IDJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNraXA6IChkZWZhdWx0U2V0LnBhZ2UgLSAxKSAqIGRlZmF1bHRTZXQucGVyUGFnZSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiBkZWZhdWx0U2V0LnBlclBhZ2VcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCduYXZCYXInLCBuYXZCYXJGbik7XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2QmFyRm4gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9uYXYtYmFyLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXZCYXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbmF2QmFyJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE5hdkJhckNvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCJtb2RhbFNlcnZpY2VcIiwgXCIkc3RhdGVcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ05hdkJhckNvbnRyb2xsZXInLCBOYXZCYXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBOYXZCYXJDb250cm9sbGVyICgkcm9vdFNjb3BlLCBtb2RhbFNlcnZpY2UsICRzdGF0ZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLm9wZW4gPSBvcGVuO1xyXG4gICAgICAgIHNlbGYubG9nb3V0ID0gbG9nb3V0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuICgpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSBtb2RhbFNlcnZpY2UuZ2V0TW9kYWwodHJ1ZSxcclxuICAgICAgICAgICAgICAgICdjb21tb24vbW9kYWxzLnRtcGwvdGVtcGxhdGVzL21vZGFsQXV0aC50bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgJ01vZGFsQXV0aENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgJ21vZGFsQXV0aCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsQXV0aENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNb2RhbEF1dGhDb250cm9sbGVyJywgTW9kYWxBdXRoQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTW9kYWxBdXRoQ29udHJvbGxlciAoJHVpYk1vZGFsSW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtFZGl0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiZGF0YVwiLCBcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua0VkaXRDb250cm9sbGVyJywgTGlua0VkaXRDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rRWRpdENvbnRyb2xsZXIgKGRhdGEsICR1aWJNb2RhbEluc3RhbmNlLCBsaW5rU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbGluaycsIGRhdGEpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0VkaXQgbGluayc7XHJcbiAgICAgICAgc2VsZi5saW5rVG9FZGl0ID0gZGF0YTtcclxuICAgICAgICBzZWxmLnNhdmUgPSBzYXZlO1xyXG4gICAgICAgIHNlbGYuY2xvc2UgPSBjbG9zZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2UgKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZSAoZWRpdGVkTGluaykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWRpdGVkTGluayknLCBlZGl0ZWRMaW5rKTtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2UudXBkYXRlTGluayhlZGl0ZWRMaW5rKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MoJ0xpbmsgdXBkYXRlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtEZXRhaWxzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiZGF0YVwiLCBcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwiJHN0YXRlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rRGV0YWlsc0NvbnRyb2xsZXInLCBMaW5rRGV0YWlsc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtEZXRhaWxzQ29udHJvbGxlciAoZGF0YSwgJHVpYk1vZGFsSW5zdGFuY2UsICRzdGF0ZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0xpbmsgZGV0YWlscyc7XHJcbiAgICAgICAgc2VsZi5lZGl0b3JFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgc2VsZi5saW5rID0gZGF0YS5saW5rO1xyXG4gICAgICAgIHNlbGYuc3VtID0gZGF0YS5zdW07XHJcbiAgICAgICAgc2VsZi5jbG9zZSA9IGNsb3NlO1xyXG4gICAgICAgIHNlbGYuZ2V0TGlua3NCeVRhZyA9IGdldExpbmtzQnlUYWc7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzQnlUYWcgKHRhZykge1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3RhZycsIHt0YWc6IHRhZ30pXHJcbiAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbGlua3NUYWJsZScsIGxpbmtzVGFibGUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtzVGFibGUgKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2xpbmtzVGFibGUvdGVtcGxhdGUvbGlua3NUYWJsZS10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua3NUYWJsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rc1RhYmxlQ3RybCcsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIGxpbmtzOiAnPScsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzOiAnJicsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJz0nLFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlOiAnJidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtzVGFibGVDb250cm9sbGVyLiRpbmplY3QgPSBbXCJtb2RhbFNlcnZpY2VcIiwgXCJsaW5rU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rc1RhYmxlQ29udHJvbGxlcicsIExpbmtzVGFibGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rc1RhYmxlQ29udHJvbGxlciAobW9kYWxTZXJ2aWNlLCBsaW5rU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5saW5rRGV0YWlscyA9IGxpbmtEZXRhaWxzO1xyXG4gICAgICAgIHNlbGYuZWRpdExpbmsgPSBlZGl0TGluaztcclxuICAgICAgICBzZWxmLmRlbGV0ZUxpbmsgPSBkZWxldGVMaW5rO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rRGV0YWlscyAobGlua0lkKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua0J5SWQobGlua0lkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZ2V0bGlua0RldGFpbHNTdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldGxpbmtEZXRhaWxzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0bGlua0RldGFpbHNTdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMuZGF0YScsIHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gbW9kYWxTZXJ2aWNlLmdldE1vZGFsKHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbW1vbi9tb2RhbHMudG1wbC90ZW1wbGF0ZXMvbGlua0RldGFpbHMudG1wbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAnTGlua0RldGFpbHNDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnbGlua0RldGFpbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRsaW5rRGV0YWlsc0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBlZGl0TGluayAobGluaykge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9IG1vZGFsU2VydmljZS5nZXRNb2RhbCh0cnVlLFxyXG4gICAgICAgICAgICAgICAgJ2NvbW1vbi9tb2RhbHMudG1wbC90ZW1wbGF0ZXMvbGlua0VkaXQudG1wbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICdMaW5rRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgJ2xpbmtFZGl0JyxcclxuICAgICAgICAgICAgICAgIGxpbmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWxldGVMaW5rIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgc2VsZi5kZWxldGUoe2xpbmtJZDogbGlua0lkfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xpbmtGb3JtJywgbGlua0Zvcm0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtGb3JtICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9saW5rRm9ybS90ZW1wbGF0ZS9saW5rRm9ybS10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua0Zvcm1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua0Zvcm1DdHJsJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnJicsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiAnPScsXHJcbiAgICAgICAgICAgICAgICBjbG9zZTogJyYnXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rRm9ybUNvbnRyb2xsZXInLCBMaW5rRm9ybUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtGb3JtQ29udHJvbGxlciAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuc2F2ZSA9IHNhdmU7XHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBjYW5jZWw7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUgKGxpbmspIHtcclxuICAgICAgICAgICAgc2VsZi5hY3Rpb24oe2xpbms6IGxpbmt9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsIChsaW5rKSB7XHJcbiAgICAgICAgICAgIHNlbGYubGluayA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwVXNlciA9IHNpZ251cFVzZXI7XHJcbiAgICAgICAgc2VsZi5kZWZhdWx0UmVxdWVzdCA9IGRlZmF1bHRSZXF1ZXN0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3NpZ251cCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWZhdWx0UmVxdWVzdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnYXV0aEZvcm0nLCBhdXRoRm9ybSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aEZvcm0gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2F1dGgvdG1wbC9hdXRoLWZvcm0tdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0F1dGhGb3JtQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2F1dGhmb3JtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgY2xvc2U6ICcmJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgQXV0aEZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCIsIFwiJHN0YXRlXCIsIFwiJHJvb3RTY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignQXV0aEZvcm1Db250cm9sbGVyJywgQXV0aEZvcm1Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBBdXRoRm9ybUNvbnRyb2xsZXIgKGF1dGhTZXJ2aWNlLCBBbGVydGlmeSwgJHN0YXRlLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYubG9naW4gPSBsb2dpbjtcclxuICAgICAgICBzZWxmLnNpZ251cCA9IHNpZ251cDtcclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGNhbmNlbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW5Mb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAubG9naW5Vc2VyKHVzZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihsb2dpblN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvZ2luU3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cCAodXNlcikge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5cclxuICAgICAgICAgICAgICAgIHNpZ251cFVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKHNpZ25VcFN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNpZ25VcFN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKCdMb2cgaW4sIHBsZWFzZScpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwgKCkge1xyXG4gICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlciAoZXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIuZGF0YS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBlcnIuZGF0YS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVyci5kYXRhLmVycm9ycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IGNvbnRpbnVlIH1cclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5lcnJvcnNba2V5XS5tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBsaW5rU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2xpbmtTZXJ2aWNlJywgbGlua1NlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZ2V0TGlua3MgPSBnZXRMaW5rcztcclxuICAgICAgICBzZWxmLmFkZExpbmsgPSBhZGRMaW5rO1xyXG4gICAgICAgIHNlbGYuZ2V0VXNlckxpbmtzID0gZ2V0VXNlckxpbmtzO1xyXG4gICAgICAgIHNlbGYuZ2V0TGlua0J5SWQgPSBnZXRMaW5rQnlJZDtcclxuICAgICAgICBzZWxmLnVwZGF0ZUxpbmsgPSB1cGRhdGVMaW5rO1xyXG4gICAgICAgIHNlbGYuZGVsZXRlTGluayA9IGRlbGV0ZUxpbms7XHJcbiAgICAgICAgc2VsZi5nZXRMaW5rQnlUYWcgPSBnZXRMaW5rQnlUYWc7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzIChwYWdpbmF0aW9uU2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFnaW5hdGlvblNldFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZExpbmsgKGxpbmspIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGxpbmtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyTGlua3MgKHBhZ2luYXRpb25TZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvdXNlckxpbmtzJyxcclxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFnaW5hdGlvblNldFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlua0J5SWQgKGxpbmtJZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbGlua0lkJywgbGlua0lkKTtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MvJyArIGxpbmtJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTGluayAoZWRpdGVkTGluaykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZWRpdGVkTGluaycsIGVkaXRlZExpbmspO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rcycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBlZGl0ZWRMaW5rXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWxldGVMaW5rIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2xpbmtJZCcsIGxpbmtJZCk7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzLycgKyBsaW5rSWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtCeVRhZyAodGFnLCBwYWdpbmF0aW9uU2V0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YWcnLCB0YWcpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rc0J5VGFnLycgKyB0YWcsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhZ2luYXRpb25TZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29uZmlnKGNvbmZpZyk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29uZmlnICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgICAgIGdldExpbmtzLiRpbmplY3QgPSBbXCJsaW5rU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCIsIFwiY29tbW9uU2VydmljZVwiXTtcclxuICAgICAgICBnZXRMaW5rQnlUYWcuJGluamVjdCA9IFtcIiRzdGF0ZVBhcmFtc1wiLCBcImNvbW1vblNlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcImxpbmtTZXJ2aWNlXCJdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCckc3RhdGVQcm92aWRlcicsICRzdGF0ZVByb3ZpZGVyKTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2xpbmtzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbGlzdExpbmtzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpbmtzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rc0N0cmwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkTGlua3M6IGdldExpbmtzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgndGFnJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3RhZy86dGFnJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbGlua3NCeVRhZy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0J5VGFnQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rc0J5VGFnJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZEJ5VGFnOiBnZXRMaW5rQnlUYWdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzIChsaW5rU2VydmljZSwgQWxlcnRpZnksIGNvbW1vblNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua3MoY29tbW9uU2VydmljZS5nZXRQYWdpbmF0aW9uU2V0KCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3M6IGNvbW1vblNlcnZpY2UuY2hlY2tFZGl0KHJlcy5kYXRhLmxpbmtzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHJlcy5kYXRhLmNvdW50XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKCdFcnJvciBnZXR0aW5nIGxpbmtzJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlua0J5VGFnICgkc3RhdGVQYXJhbXMsIGNvbW1vblNlcnZpY2UsIEFsZXJ0aWZ5LCBsaW5rU2VydmljZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJHN0YXRlcGFyYW1zJywgJHN0YXRlUGFyYW1zLnRhZyk7XHJcbiAgICAgICAgICAgIHJldHVybiBsaW5rU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmdldExpbmtCeVRhZygkc3RhdGVQYXJhbXMudGFnLCBjb21tb25TZXJ2aWNlLmdldFBhZ2luYXRpb25TZXQoKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rczogcmVzLmRhdGEubGlua3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiByZXMuZGF0YS5jb3VudFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTGlua3NDb250cm9sbGVyLiRpbmplY3QgPSBbXCJsaW5rU2VydmljZVwiLCBcInJlc29sdmVkTGlua3NcIiwgXCJBbGVydGlmeVwiLCBcImNvbW1vblNlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzQ29udHJvbGxlcicsIExpbmtzQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NDb250cm9sbGVyIChsaW5rU2VydmljZSwgcmVzb2x2ZWRMaW5rcywgQWxlcnRpZnksIGNvbW1vblNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdBbGwgbGlua3M6ICcgKyByZXNvbHZlZExpbmtzLmNvdW50O1xyXG4gICAgICAgIHNlbGYubGlua3MgPSByZXNvbHZlZExpbmtzLmxpbmtzO1xyXG4gICAgICAgIHNlbGYuY291bnQgPSByZXNvbHZlZExpbmtzLmNvdW50O1xyXG4gICAgICAgIHNlbGYuY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAgIHNlbGYuaXRlbXNQZXJQYWdlID0gMjtcclxuICAgICAgICBzZWxmLnBhZ2VDaGFuZ2VkID0gcGFnZUNoYW5nZWQ7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBhZ2VDaGFuZ2VkICgpIHtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRMaW5rcyhjb21tb25TZXJ2aWNlLmdldFBhZ2luYXRpb25TZXQoc2VsZi5jdXJyZW50UGFnZSwgc2VsZi5pdGVtc1BlclBhZ2UpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZ2V0TGlua3NTdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldExpbmtzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NTdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubGlua3MgPSByZXMuZGF0YS5saW5rcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMaW5rc0Vycm9yICgpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBMaW5rc0J5VGFnQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcImNvbW1vblNlcnZpY2VcIiwgXCJyZXNvbHZlZEJ5VGFnXCIsIFwiJHN0YXRlUGFyYW1zXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rc0J5VGFnQ29udHJvbGxlcicsIExpbmtzQnlUYWdDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rc0J5VGFnQ29udHJvbGxlciAobGlua1NlcnZpY2UsIEFsZXJ0aWZ5LCBjb21tb25TZXJ2aWNlLCByZXNvbHZlZEJ5VGFnLCAkc3RhdGVQYXJhbXMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZ2V0TGlua0J5VGFnJyxyZXNvbHZlZEJ5VGFnKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdXZSBoYXZlICcgKyByZXNvbHZlZEJ5VGFnLmNvdW50ICsgJyBsaW5rcyB3aXRoIHRhZzogJyArICRzdGF0ZVBhcmFtcy50YWc7XHJcbiAgICAgICAgc2VsZi5saW5rcyA9IHJlc29sdmVkQnlUYWcubGlua3M7XHJcbiAgICAgICAgc2VsZi5jb3VudCA9IHJlc29sdmVkQnlUYWcuY291bnQ7XHJcbiAgICAgICAgc2VsZi5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgc2VsZi5pdGVtc1BlclBhZ2UgPSAyO1xyXG4gICAgICAgIHNlbGYucGFnZUNoYW5nZWQgPSBwYWdlQ2hhbmdlZDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGFnZUNoYW5nZWQgKCkge1xyXG4gICAgICAgICAgICBsaW5rU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmdldExpbmtzKGNvbW1vblNlcnZpY2UuZ2V0UGFnaW5hdGlvblNldChzZWxmLmN1cnJlbnRQYWdlLCBzZWxmLml0ZW1zUGVyUGFnZSkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihnZXRMaW5rc1N1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZ2V0TGlua3NFcnJvcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMaW5rc1N1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5saW5rcyA9IHJlcy5kYXRhLmxpbmtzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldExpbmtzRXJyb3IgKCkge1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIiwgXCIkdXJsUm91dGVyUHJvdmlkZXJcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIGdldFVzZXJMaW5rcy4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcImNvbW1vblNlcnZpY2VcIl07XHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnaG9tZScpO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvaG9tZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUvdmlld3MvbWFpbi5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFVzZXJMaW5rczogZ2V0VXNlckxpbmtzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyTGlua3MgKGxpbmtTZXJ2aWNlLCBBbGVydGlmeSwgY29tbW9uU2VydmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRVc2VyTGlua3MoY29tbW9uU2VydmljZS5nZXRQYWdpbmF0aW9uU2V0KCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uU2VydmljZS5jaGVja0VkaXQocmVzLmRhdGEubGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKCdFcnJvciBnZXR0aW5nIGxpbmtzJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0gKCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gW1wicmVzb2x2ZWRVc2VyTGlua3NcIiwgXCJBbGVydGlmeVwiLCBcImxpbmtTZXJ2aWNlXCIsIFwiY29tbW9uU2VydmljZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIgKHJlc29sdmVkVXNlckxpbmtzLCBBbGVydGlmeSwgbGlua1NlcnZpY2UsIGNvbW1vblNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgc2VsZi5pdGVtc1BlclBhZ2UgPSAyO1xyXG4gICAgICAgIHNlbGYuY291bnQgPSByZXNvbHZlZFVzZXJMaW5rcy5jb3VudDtcclxuICAgICAgICBzZWxmLnRpdGxlID0gZ2V0VGl0bGUocmVzb2x2ZWRVc2VyTGlua3MuY291bnQpO1xyXG4gICAgICAgIHNlbGYuYWRkTGluayA9IGFkZExpbms7XHJcbiAgICAgICAgc2VsZi51c2VyTGlua3MgPSByZXNvbHZlZFVzZXJMaW5rcy5saW5rcztcclxuICAgICAgICBzZWxmLnBhZ2VDaGFuZ2VkID0gcGFnZUNoYW5nZWQ7XHJcbiAgICAgICAgc2VsZi5kZWxldGVMaW5rID0gZGVsZXRlTGluaztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGluayAobGluaykge1xyXG4gICAgICAgICAgICBsaW5rU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmFkZExpbmsobGluaylcclxuICAgICAgICAgICAgICAgIC50aGVuKGFkZExpbmtSZXN1bHQpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goYWRkTGlua0Vycm9yKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZExpbmtSZXN1bHQgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5saW5rID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHNlbGYucGFnZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MoJ0xpbmsgYWRkZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkTGlua0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHBhZ2VDaGFuZ2VkICgpIHtcclxuICAgICAgICAgICAgbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRVc2VyTGlua3MoY29tbW9uU2VydmljZS5nZXRQYWdpbmF0aW9uU2V0KHNlbGYuY3VycmVudFBhZ2UsIHNlbGYuaXRlbXNQZXJQYWdlKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldExpbmtzUmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldExpbmtzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NSZXN1bHQgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi51c2VyTGlua3MgPSBjb21tb25TZXJ2aWNlLmNoZWNrRWRpdChyZXMuZGF0YS5saW5rcyk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNvdW50ID0gcmVzLmRhdGEuY291bnQ7XHJcbiAgICAgICAgICAgICAgICBnZXRUaXRsZShyZXMuZGF0YS5jb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NFcnJvciAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBnZXRUaXRsZSAoY291bnQpIHtcclxuICAgICAgICAgICAgc2VsZi50aXRsZSA9ICdNeSBsaW5rczonICsgY291bnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnRpdGxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWxldGVMaW5rIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgQWxlcnRpZnlcclxuICAgICAgICAgICAgICAgIC5jb25maXJtKCdEbyB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBsaW5rPycpXHJcbiAgICAgICAgICAgICAgICAudGhlbihwb3NpdGl2ZUFuc3Zlcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBwb3NpdGl2ZUFuc3ZlciAoKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5rU2VydmljZS5kZWxldGVMaW5rKGxpbmtJZClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MoJ0xpbmsgcmVtb3ZlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoSW50ZXJjZXBvci4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiR3aW5kb3dcIiwgXCIkY29va2llc1wiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2Vwb3InLCBhdXRoSW50ZXJjZXBvcik7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aEludGVyY2Vwb3IgKCRyb290U2NvcGUsICR3aW5kb3csICRjb29raWVzKSB7XHJcbiAgICAgICAgdmFyIGF1dGhJbnRlcmNlcG9yID0ge1xyXG4gICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHJlc3BvbnNlLmhlYWRlcnMoJ3gtYWNjZXNzLXRva2VuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXNwb25zZS5oZWFkZXJzKCdpZCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJOYW1lID0gcmVzcG9uc2UuaGVhZGVycygndXNlck5hbWUnKTtcclxuICAgICAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLmNhbkxvZ2luKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb29raWVzLnB1dCgnaWQnLCBpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZCkgeyAkd2luZG93LmxvY2FsU3RvcmFnZS5pZCA9IGlkOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyTmFtZSkgeyAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VyTmFtZSA9IHVzZXJOYW1lOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nZ2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gYXV0aEludGVyY2Vwb3I7XHJcblxyXG4gICAgfVxyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
