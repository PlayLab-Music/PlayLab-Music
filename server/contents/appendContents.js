function appendContents(db_infos){
    // db_infos = [(youtube_id, title, singer), (youtube_id, title, singer),...]

    console.log("myScript");
    console.log(Date.now());
    var infos = db_infos;
    var players = [];
    if(onYouTubeIframeAPIReady){
        window.YT.ready(function(){
            $("#glider").children().remove();
            console.log("youtube contents");
            console.log(Date.now());
            // db_infos 리스트로 검색결과
            for(var i in infos){
                var youtubeId = infos[i][0];
                var title = infos[i][1];
                var singer = infos[i][2];
                var div_id = '<div class="content-box-wrapper" id="'+youtubeId+'"></div>';
                var div_tag = $(div_id);

               
                div_tag.appendTo($(".glider"));
                var pl = createContentBox($(div_tag), infos[i][0]);
                players.push(pl);
                var info_tag = '<div class="song_info" data-singer="'+singer+'" data-title="'+ title +'">'+title+'-'+singer+'</div>';
                $(info_tag).appendTo($(div_tag));

                console.log(i);
            };
        });
    };
};


function createGlider(){
    var currentSlide;
    document.querySelector('#glider').addEventListener('glider-slide-visible', function(event){
        var glider = Glider(this);
        if (currentSlide){
            currentSlide.css('transform', 'scale(1.0)')
        }

        currentSlide = $(".glider-slide.center")
        console.log('Slide Visible %s', event.detail.slide);
        
    });
    document.querySelector('#glider').addEventListener('glider-slide-hidden', function(event){
        console.log('Slide Hidden %s', event.detail.slide)
    });
    document.querySelector('#glider').addEventListener('glider-refresh', function(event){
        console.log('Refresh')
    });
    document.querySelector('#glider').addEventListener('glider-loaded', function(event){
        console.log('Loaded')
    });
    document.querySelector("#glider").addEventListener("glider-animated",function(){
        console.log("aniani")
    })

    var gliders;
    window.gliders = new Glider(document.querySelector('#glider'), {
        slidesToShow: 'auto',
        slidesToScroll: 1,
        itemWidth: 150,
        draggable: true,
        scrollLock: false,
        rewind: true,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToScroll: 'auto',
                    itemWidth: 300,
                    slidesToShow: 5,
                    exactWidth: true
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToScroll: 4,
                    slidesToShow: 4,
                    dots: false,
                    arrows: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToScroll: 3,
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToScroll: 2,
                    slidesToShow: 2,
                    dots: false,
                    arrows: false,
                    scrollLock: true
                }
            }
        ]
    });
    console.log("created")
    $(".glider-track").remove()
    };