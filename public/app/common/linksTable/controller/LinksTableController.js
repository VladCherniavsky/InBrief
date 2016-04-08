(function () {
    angular
        .module('InBrief')
        .controller('LinksTableController', LinksTableController);

    function LinksTableController (modalService, linkService, Alertify) {
        var self = this;
        self.linkDetails = linkDetails;



        function linkDetails (linkId) {
            console.log('linkId', linkId);
            linkService
                .getLinkById(linkId)
                .then(getlinkDetailsSuccess)
                .catch(getlinkDetailsError);


        }

        function getlinkDetailsSuccess (res) {
            console.log('res.data', res.data);
            var modalInstance = modalService.getModal(true, 'common/modals.tmpl/templates/linkDetails-tmpl.html', 'LinkDetailsController', 'linkDetailsCtrl', res.data);
        }
        function getlinkDetailsError (err) {
            Alertify.error(err.data.message);
        }

    }
}());