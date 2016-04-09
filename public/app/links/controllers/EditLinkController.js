(function () {
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