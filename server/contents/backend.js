function getAutocompletList(param){
    $.ajax({
        type: 'POST',
        url: '../1.php',
        data: param,
        dataType: 'json',
        success: function (data) {
          autocomplete(data);
        },
        error: function () {
          var autoLists = ["가시 - 버즈", "엄청나게 긴 이름으로 해보자 - 임재범", "배고픈걸까..? - 송윤상", "지금 시각은 새벽 4시 7분 - 차뇽", "귀여운이름 - 까꿍", "sing5 - 5"];
          autocomplete(autoLists);
        }
    });
};

function getVideoData(param){
    $.ajax({
        type: 'POST',
        url: '../2.php',
        data: param,
        dataType: 'json',
        success: function(data){
                console.log(data);
                appendSliders(data);
        },
        error: function(){
            var dbInfos = [["bqfOALK0qnc","dsadsadasfafsafsadcz","fasddcczvcdva"],["GP5t5ZYfgZw","1","1"],["XSj14Bg3cPE","2","2"],["JBMpAOuDLbg","3","3"], ["O1JUyyNHROc","4","4"],["X_sR3nyL-q8","5","5"], ["7kII76zHLRg","6","6"], ["LvANkO6Wfjc","7","7"], ["GHb5ox62bKM","8","8"]];
            console.log("error on getting videos");
            appendSliders(dbInfos);
        }
    });
};