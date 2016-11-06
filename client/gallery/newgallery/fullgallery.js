Template.newgallery.helpers({
    'images':function(){
        return Images.find();
    }
});

Template.newgallery.rendered=function(){
    $(window).resize(function () {
        $('.current-image-wrapper').css('max-height', document.documentElement.clientHeight-200);
        $('.current-image').css('max-height', document.documentElement.clientHeight-220)
    })
    $('.current-image-wrapper').css('max-height', document.documentElement.clientHeight-200);
    $('.current-image').css('max-height', document.documentElement.clientHeight-220);
    $('.placehold').fadeIn(200);
    var dropZone=$('.add-image-zone');
    maxFileSize = 4000000;
    if (typeof(window.FileReader) == 'undefined') {
        sAlert.error('Загрузка файлов не поддерживается браузером');
        dropZone.addClass('error');
    }
    dropZone[0].ondragover = function() {
        dropZone.addClass('hover');
        return false;
    };

    dropZone[0].ondragleave = function() {
        dropZone.removeClass('hover');
        return false;
    };
    dropZone[0].ondrop = function(event) {
        event.preventDefault();
        dropZone.removeClass('hover');
        dropZone.addClass('drop');

        var file = event.dataTransfer.files[0];

        if (file.size > maxFileSize) {
            sAlert.error('Файл слишком большой!');
            dropZone.addClass('error');
            return false;
        }
        document.querySelector('.greenfield').className='greenfield fa fa-spinner fa-spin';

        Images.insert(file, function(err, imageId){
            if(err){
                sAlert.error('Ошибка при загрузке файла');
                return false;
            }
            setTimeout(function(){
                dropZone.before($(`<div class="img-thumbnail-wrapper"> <div class="remove-image"><i class="fa fa-remove"></i></div> <img class="img-thumbnail" src="/cfs/files/images/${imageId._id}"></div>`));
                if($('.img-thumbnail-wrapper').length==2){
                    document.querySelector('.bigpicture').outerHTML=`<img class="current-image" data-currentid="0" src="/cfs/files/images/${imageId._id}">`
                    $('.current-image').css('max-height', document.documentElement.clientHeight-220);
                }
                document.querySelector('.greenfield').className='greenfield fa fa-plus';
            }, 1000);
        })
    };
}

Template.newgallery.events({
    'click .remove-image':function(e){
        $(e.currentTarget).parent().remove();
    },
    'click .save-gallery-btn':function () {
        var title=$('.newgallery .title').html();
        var desc=$('.newgallery .description').html();
        var imagesAdddrs=[]
        var images=$('.img-thumbnail-wrapper').not('.add-picture').find('img').each((k,i)=>imagesAdddrs.push(i.src));
        var galleryObj={
            title:title,
            description:desc,
            images:[]
        };
        imagesAdddrs.forEach((i)=>galleryObj.images.push({address:i}));
        window[this.collectionName].insert(galleryObj);
        $('.placehold').fadeOut(200, function(){$('.newgallery').remove()});
    }
})