$(document).ready(function(){
    var players = [];
    // 스크롤 업
    $("html, body").animate({scrollTop: 0}, 500);   
    createGlider()
  
    // 검색창 마우스 포커싱
    $(".search-bar")
      .keydown(function(e){
        if(e.keyCode==13){
          var splitInput = Hangul.disassemble($("#TxtSearch").val());
          // 자모음 분리로 db검색후 반환
          var dbInfos;
          
          // 함수구현

          //dbInfos = '[["bqfOALK0qnc","0","1"],["GP5t5ZYfgZw","1","1"],["XSj14Bg3cPE","2","2"],["JBMpAOuDLbg","3","3"], ["O1JUyyNHROc","4","4"],["X_sR3nyL-q8","5","5"], ["7kII76zHLRg","6","6"], ["LvANkO6Wfjc","7","7"], ["GHb5ox62bKM","8","8"]]'

var param = {name: '가시 - 버즈'}
$.ajax({
   type: 'POST',
   url: '/2.php',
   data: param,
   dataType: 'json',
   success: function(data){
//        console.log(data);
//	alert(data);
//          dbInfos = JSON.parse(data);
          appendContents(data);
   }
});

          
        }else{
          // 자동완성기능
          var splitInput = Hangul.disassemble($("#TxtSearch").val());
          var disassembleInput = splitInput.push(e.key)
          disassembleInput
          console.log(splitInput)
        };
      });


});
          // 자동 재생기능 추가 예정
          // now = players[0]
          // function checkTime() {
          //   console.log(now.getDuration()," and ",now.getCurrentTime())
          //   if(now.getDuration()-2<=now.getCurrentTime()){
          //     console.log("wow");
          //     players.forEach(function(player){
          //       youTubePlayerPause(player)
          //     });
          //     now = players[1];
          //     youTubePlayerPlay(now);
          //   }
          // }
          
          //  setInterval(checkTime, 1000)
