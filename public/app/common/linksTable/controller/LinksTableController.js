(function () {
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