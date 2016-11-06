Template.carousel.helpers({
    'carouselItem': function () {
        return window[this.collectionName].find();
    },
    'headerImageAddress':function(){
        return this.images[0].address;
    }
});

function validURL(s) { // http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    var regexp = /(ftp|http|https|file):(\/){2,3}(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

Template.carousel.events({
    'click .add-new-gallery': function () {
        Blaze.renderWithData(Template.newgallery,{collectionName:Template.currentData().collectionName}, document.querySelector('.placehold'));
    },
    'click .remove-gallery':function(e){
        window[Template.currentData().collectionName].remove($(e.currentTarget).data('galleryid'), (e)=>{if(e){sAlert.error(e.reason)}});
    },
    'click .btn-add-url': function () {
        $('<input class="form-control picture-url-input"><br>').appendTo($('.photo-urls-wrapper'));
    },
    'click .true-gallery-click-area':function (e) {
        var gID=$(e.currentTarget).data('galleryid');
        var g=window[Template.currentData().collectionName].find({_id:gID}).fetch();
        g[0].galleryName=Template.currentData().collectionName;
        Blaze.renderWithData(Template.ufgallery,g[0] , document.querySelector('.placehold'));
    },
    'click .save-gallery': function (e) {
        var root=e.currentTarget.parentNode.parentNode;
        var links = $(root).find('.picture-url-input');
        var true_links = [];
        for (var k = 0; k < links.length; k++) {
            var link=links[k].value;
            if (!validURL(link) && link != '') {
                sAlert.error(link + ' не похоже на ссылку на фотографию');
                return false
            }
            true_links.push(link)
        }
        true_links=true_links.filter((i)=>i!='');
        var title=$(root).find('.title-input').val();
        var desc=$(root).find('.desc-input').val()  ;
        var d={
            title:title,
            description:desc,
            images:[]
        };
        true_links.forEach((i)=>d.images.push({address:i}));
        window[Template.currentData().collectionName].insert(d);
    },
});