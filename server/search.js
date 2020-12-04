$(document).ready(function () {
  // 스크롤 업
  $("html, body").animate({ scrollTop: 0 }, 500);

  var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  });

  // db_infos 리스트로 검색결과
  var infos = [["bqfOALK0qnc", "dsadsadasfafsafsadcz", "fasddcczvcdva"], ["GP5t5ZYfgZw", "1", "1"], ["XSj14Bg3cPE", "2", "2"], ["JBMpAOuDLbg", "3", "3"], ["O1JUyyNHROc", "4", "4"], ["X_sR3nyL-q8", "5", "5"], ["7kII76zHLRg", "6", "6"], ["LvANkO6Wfjc", "7", "7"], ["GHb5ox62bKM", "8", "8"]]
  swiper.removeAllSlides()

  window.player = null;

  //  검색창 마우스 포커싱
  $(".search-bar")
    .keyup(function (e) {
      // 자동완성기능
      var splitInput = Hangul.disassemble($("#TxtSearch").val());
      var joinedInput = splitInput.join("").replace(" ","");
      console.log(joinedInput)
      var autoParam = { name: joinedInput }
      $.ajax({
        type: 'POST',
        url: './1.php',
        data: autoParam,
        dataType: 'json',
        success: function (data) {
          console.log(data);
          autocomplete(swiper, data);
        },
        error: function (data) {
          var autoLists = ["singsdasfasfsaf0 - 0fdsvfdvfdvsdcs", "sing1 - 1", "sing2 - 2", "sing3 - 3", "sing4 - 4", "sing5 - 5"]
          autocomplete(swiper, autoLists)
        }
      });

    });
  
  swiper.on('touchEnd', function(e){
    if(window.player == getPlayer()){
      console.log("same")
    }else{
      window.player = getPlayer();
      setPlayerInfo();
    }
    
    
  });

});


