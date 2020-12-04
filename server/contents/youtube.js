function createPlayer(div_tag, id, height, width) {
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
        var volume = Math.round(event.target.getVolume());
        var volumeItem = document.getElementById(youTubePlayerVolumeItemId);

        if (volumeItem && (Math.round(volumeItem.value) != volume)) {
            volumeItem.value = volume;
        }
    }

    var player = new YT.Player(div_tag,
                                {videoId: videoId,
                                height: "150",
                                width: "150",
                                name: name,
                                playerVars: {'autohide': 1,
                                                'cc_load_policy': 0,
                                                'controls':1,
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
    }
}

// Add time slider

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
}


//check api loaded
function onYouTubeIframeAPIReady(){
    return true
}
























