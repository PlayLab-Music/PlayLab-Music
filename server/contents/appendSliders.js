function appendSliders(swiper, db_infos){
    // db_infos = [(youtube_id, title, singer), (youtube_id, title, singer),...]

    var infos = db_infos;
    var players = [];
    if(onYouTubeIframeAPIReady){
        window.YT.ready(function(){
            for(var i in infos){
                // swiper-slide > swiper-content > youtube-info, iframe
                // will add id, title, singer in swiper-content with data

                var youtubeId = infos[i][0];
                var title = infos[i][1];
                var singer = infos[i][2];
    
                var info_tag_txt = '<div class="youtube-info">'+ title + '-' + singer +'</div>';
                var info_tag = $(info_tag_txt);
    
                var content_tag_txt = '<div class="swiper-content"></div>';
                var content_tag = $(content_tag_txt);
                content_tag.data("title", title);
                content_tag.data("singer", singer);
    
                var swiper_slide_txt = '<div class="swiper-slide"></div>';
                var swiper_slide = $(swiper_slide_txt);
    

                info_tag.appendTo(content_tag);
                content_tag.appendTo(swiper_slide);
                swiper_slide.appendTo($(".swiper-wrapper"));
                swiper.appendSlide(swiper_slide.get(0))
                var pl = createContentBox($(content_tag), youtubeId);
                //players.push(pl);
                swiper.update()
            };
            window.player = getPlayer()
            setPlayerInfo();
        });
    };
};

function getSwiperContent(){
    return $(".swiper-slide-active").find(".swiper-content")
}

function getPlayer(){
    return getSwiperContent().data("player")
}
function getPlayerTitle(){
    return getSwiperContent().data("title")
}
function getPlayerSinger(){
    return getSwiperContent().data("singer")
}

function setPlayerInfo(){
    var title = getPlayerTitle();
    var singer = getPlayerSinger();
    console.log(title)
    if(title && singer){
        $(".player-title").text(title);
        $(".player-singer").text(singer);
    }
}