Template.ufgallery.helpers({
    'getFirstImageAddress':function(){
        return this.images[0].address;
    }
});

Template.ufgallery.rendered=function(){
    $('.placehold').fadeIn(200);
    $(window).resize(function () {
        $('.current-image-wrapper').css('max-height', document.documentElement.clientHeight-200);
        $('.current-image').css('max-height', document.documentElement.clientHeight-220)
    })
    $('.current-image-wrapper').css('max-height', document.documentElement.clientHeight-200);
    $('.current-image').css('max-height', document.documentElement.clientHeight-220);
    var dropZone=$('.add-image-zone'),
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
    var self=this;
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
            console.log(self);
            window[self.data.galleryName].update({_id:self.data._id}, {$addToSet:{images:{address:`/cfs/files/images/${imageId._id}`}}});
            setTimeout(function(){
                dropZone.before($(`<div class="img-thumbnail-wrapper"><div class="remove-image"><i class="fa fa-remove"></i></div> <img class="img-thumbnail" src="/cfs/files/images/${imageId._id}"></div>`));
                if($('.img-thumbnail-wrapper').length==2){
                    document.querySelector('.bigpicture').outerHTML=`<img class="current-image" data-currentid="0" src="/cfs/files/images/${imageId._id}">`
                }
                document.querySelector('.greenfield').className='greenfield fa fa-plus';
            }, 1000 );
        })
    };
}

Template.ufgallery.events({
    'blur .title':function (e) {
        window[Template.currentData().galleryName].update({_id:Template.currentData()._id}, {$set:{title:e.currentTarget.innerHTML}});
    },
    'blur .description':function (e) {
        window[Template.currentData().galleryName].update({_id:Template.currentData()._id}, {$set:{description:e.currentTarget.innerHTML}});
    },
    'click .remove-image':function(e){
        var images=window[Template.currentData().galleryName].findOne({_id:Template.currentData()._id}).images.filter((i)=>i.address!=this.address);
        window[Template.currentData().galleryName].update({_id:Template.currentData()._id}, {$set:{images:images}});
        $(e.currentTarget).parent().remove();
    },
    'click .img-thumbnail':function(e){
        var img=e.currentTarget;
        $('.current-image').attr('src', $(img).attr('src')).data('currentid', $(img).data('imageid'));
        $('.img-thumbnail').removeClass('active');
        $(img).addClass('active');
    },
    'click .ufgallery-wrapper':function(e){
        if(e.target.className=='ufgallery-wrapper'){
            $('.placehold').fadeOut(200, function(){$(e.target).remove()});
        }
    },
    'click .current-image':function(e){
        console.log(e.currentTarget);
        var currentId=$(e.currentTarget).data('currentid');
        if(currentId+1>this.images.length-1){
            currentId=-1;
        }
        currentId++;
        $(e.currentTarget).data('currentid', currentId);
        console.log(currentId, $('.img-thumbnail')[currentId]);
        $('.img-thumbnail')[currentId].click();

    }
})