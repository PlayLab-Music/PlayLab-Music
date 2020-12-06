<<<<<<< HEAD
function createPlayer(div_tag, id, height, width, index) {
=======
function createPlayer(div_tag, id, height, width) {
>>>>>>> 97525aa63a3a2abf780a2b6d244d5cf3b1eb4d7b
    'use strict';

    var videoId = id;
    var suggestedQuality = 'tiny';
    var height = String(height);
    var width = String(width);
    var name = id;
    var youTubePlayerVolumeItemId = 'YouTube-player-volume';


    function onError(event) {
        youTubePlayer.personalPlayer.errors.push(event.data);
    }


    function onReady(event) {
        var player = event.target;
        
        player.pauseVideo();
        // player.loadVideoById({suggestedQuality: suggestedQuality,
        //                       videoId: videoId,
        //                        title:title
        //                      });
    }


    function onStateChange(event) {
<<<<<<< HEAD
        if(youTubePlayerState(player)==1){
            if(window.player != player){
                window.swiper.slideTo(player.personalPlayer.index);
            }
        }
=======
>>>>>>> 97525aa63a3a2abf780a2b6d244d5cf3b1eb4d7b
        var volume = Math.round(event.target.getVolume());
        var volumeItem = document.getElementById(youTubePlayerVolumeItemId);

        if (volumeItem && (Math.round(volumeItem.value) != volume)) {
            volumeItem.value = volume;
        }
    }

    var player = new YT.Player(div_tag,
                                {videoId: videoId,
                                height: height,
                                width: width,
                                name: name,
                                playerVars: {'autohide': 1,
                                                'cc_load_policy': 0,
<<<<<<< HEAD
                                                'controls':0,
=======
                                                'controls':1,
>>>>>>> 97525aa63a3a2abf780a2b6d244d5cf3b1eb4d7b
                                                'disablekb': 0,
                                                'iv_load_policy': 0,
                                                'modestbranding': 0,
                                                'rel': 0,
                                                'showinfo': 0,

                                                'autoplay':0,
                                                'start': 3
                                            },
                                events: {'onError': onError,
                                            'onReady': onReady,
                                            'onStateChange': onStateChange
                                        }
                                });
                                


                                
    // Add private data to the YouTube object
    player.personalPlayer = {'currentTimeSliding': false,
                                    'id':id,
<<<<<<< HEAD
                                    'index':index,
=======
>>>>>>> 97525aa63a3a2abf780a2b6d244d5cf3b1eb4d7b
                                    'errors': []
                            };

    return player
}

                  

function youTubePlayerActive(player) {
    'use strict';
    return player && player.hasOwnProperty('getPlayerState');
}

function youTubePlayerState(player){
    'use strict';
    // 플레이어의 상태를 반환합니다. 가능한 값은 다음과 같습니다.
    // -1 –시작되지 않음
    // 0 – 종료
    // 1 – 재생 중
    // 2 – 일시중지
    // 3 – 버퍼링
    // 5 – 동영상 신호
    return player.getPlayerState();
}

function youTubePlayerPause(player) {
    'use strict';
    if (youTubePlayerActive(player)) {
        player.pauseVideo();
    }
}

function youTubePlayerPlay(player) {
    'use strict';
    if (youTubePlayerActive(player)) {
        player.playVideo();
    }
}

function youTubePlayerStop(player) {
    'use strict';
<<<<<<< HEAD
=======

>>>>>>> 97525aa63a3a2abf780a2b6d244d5cf3b1eb4d7b
    if (youTubePlayerActive(player)) {
        player.stopVideo();
        player.clearVideo();
    }
}

function youTubePlayerPercent(player){
    if (youTubePlayerState(player) == 1){
        total = player.getDuration()
        current = player.getCurrentTime()
        console.log(current*100/total)
        return current*100/total
<<<<<<< HEAD
    }else{
        return null
=======
>>>>>>> 97525aa63a3a2abf780a2b6d244d5cf3b1eb4d7b
    }
}

// Add time slider

<<<<<<< HEAD
function youTubePlayerCurrentTimeChange(currentTime) {
    'use strict';
    console.log("time_player",window.player)
    console.log("time_cur",currentTime)

    player.personalPlayer.currentTimeSliding = false;
    if (youTubePlayerActive(window.player)) {
        window.player.seekTo(currentTime*window.player.getDuration()/100, true);
    }
}

function youTubePlayerCurrentTimeSlide() {
    'use strict';
    console.log("slider",window.player)

    window.player.personalPlayer.currentTimeSliding = true;
=======
function youTubePlayerCurrentTimeChange(player, currentTime) {
    'use strict';
    console.log("time_player",player)
    console.log("time_cur",currentTime)

    // player.personalPlayer.currentTimeSliding = false;
    // if (youTubePlayerActive()) {
    //     player.seekTo(currentTime*player.getDuration()/100, true);
    // }
}

function youTubePlayerCurrentTimeSlide(player) {
    'use strict';
    console.log("slider",player)

    // player.personalPlayer.currentTimeSliding = true;
>>>>>>> 97525aa63a3a2abf780a2b6d244d5cf3b1eb4d7b
}


//check api loaded
function onYouTubeIframeAPIReady(){
    return true
}
























