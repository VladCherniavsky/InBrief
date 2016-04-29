(function () {
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