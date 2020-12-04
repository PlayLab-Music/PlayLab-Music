function appendSliders(swiper, db_infos){
    // db_infos = [(youtube_id, title, singer), (youtube_id, title, singer),...]

    var infos = db_infos;
    var players = [];
    if(onYouTubeIframeAPIReady){
        window.YT.ready(function(){
            for(var i in infos){
                var youtubeId = infos[i][0];
                var title = infos[i][1];
                var singer = infos[i][2];
    
                var info_tag_txt = '<div class="youtube-info">'+ title + '-' + singer +'</div>';
                var info_tag = $(info_tag_txt);
    
                var youtube_tag_txt = '<div class="youtube-vid" id="'+youtubeId+'"></div>';
                var youtube_tag = $(youtube_tag_txt);
                
                var content_tag_txt = '<div class="swiper-content"></div>';
                var content_tag = $(content_tag_txt);
    
                var swiper_slide_txt = '<div class="swiper-slide"></div>';
                var swiper_slide = $(swiper_slide_txt);
    
                info_tag.appendTo(content_tag);
                youtube_tag.appendTo(content_tag);
                content_tag.appendTo(swiper_slide);
                swiper_slide.appendTo($(".swiper-wrapper"));
                swiper.appendSlide(swiper_slide.get(0))
                var pl = createContentBox($(youtube_tag), infos[i][0]);
                //players.push(pl);
                swiper.update()
    
                console.log(i);
            };
        });
    };
};