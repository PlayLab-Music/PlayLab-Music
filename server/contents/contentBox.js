
function createContentBox(parentNode, youtube_id, isShow=true){
    // parentNode will be jquery elem
    // id will be number or youtube 
    var player;
    //create content box
    var content_box = '<div class="content-box '+ youtube_id + '"></div>'
    content_box = $(content_box)
    content_box.hide()

    //youtube video box
    var code = youtube_id
    var youtube_video = '<div id="video-' + youtube_id + '"></div>'
    youtube_video = $(youtube_video)
    youtube_video.appendTo(parentNode)
    player = createPlayer("video-"+youtube_id, code, 80, 80)
    player_tag = "#video-"+youtube_id
    $(player_tag).appendTo(content_box)

    content_box.appendTo(parentNode);
    if(isShow){
        content_box.show()
    }


    //add function
    // $(".content-box")
    // .mouseenter(function(e){
    //     $(this).css('transform', 'scale(1.03)');
    // })
    // .mouseleave(function(e){
    //     $(this).css('transform', 'scale(1.0)')
    // });
    content_box.on("tap",function(e){
        if(youTubePlayerState(player)==1){
            console.log("1")
            youTubePlayerPause(player);
        }else{
        youTubePlayerPlay(player);
        // var lego = youTubePlayerPercent(player)
        function lego(){
            youTubePlayerPercent(player)
        }
        setInterval(lego, 1000)
        };
    });


    // content_box.mouseenter(function(e){
    //     youTubePlayerPlay(player)
    //     console.log("2")
    // })

    // content_box.mouseleave(function(e){
    //     youTubePlayerPause(player)
    //     console.log("3")
    // })
    
//     function wow(){
//     if(player.getPlayerState() == 1){
//         console.log(player.getCurrentTime()/player.getDuration()*100)
//     }
// }
//     setInterval(wow, 1000)
    return player
};

function createMoreBox(parentNode){
    content_box = '<div class="content-box more">more</div>';
    content_box = $(content_box);
    content_box.appendTo(parentNode);
    
    $("#add")
    .click(function(e){
      $(".content-box").each(function(){
        $(this).show();
      });
    });

        //add function
    $(".content-box")
    .mouseenter(function(e){
    $(this).css('transform', 'scale(1.03)');
    })
    .mouseleave(function(e){
    $(this).css('transform', 'scale(1.0)')
    });

}
      