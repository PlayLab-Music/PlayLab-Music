$(document).ready(function () {
  // 스크롤 업
  $("html, body").animate({ scrollTop: 0 }, 500);

  window.swiper = new Swiper('.swiper-container', {
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
  window.swiper.removeAllSlides()

  window.player = null;

  // 서치 바 클릭시 제목 초기화
  $(".search-bar").click(function(e){
    $("#TxtSearch").val("");
  })

  //  검색창에 키 입력시 자동완성 입력
  $(".search-bar").keyup(function (e) {
      if(!$('#auto-box').is(":visible")){
        $('#auto-box').show()
        $('.swiper-wrapper').hide()
      }
      // 자모음 분리
      var splitInput = Hangul.disassemble($("#TxtSearch").val());
      var joinedInput = splitInput.join("").replace(" ","");
      console.log(joinedInput)
      var autoParam = { name: joinedInput }

      //비동기 처리(자동완성할 데이터 가져오기)
      $.ajax({
        type: 'POST',
        url: './1.php',
        data: autoParam,
        dataType: 'json',
        success: function (data) {
          console.log(data);
          autocomplete(data);
        },
        error: function (data) {
          var autoLists = ["가시 - 버즈", "엄청나게 긴 이름으로 해보자 - 임재범", "배고픈걸까..? - 송윤상", "지금 시각은 새벽 4시 7분 - 차뇽", "귀여운이름 - 까꿍", "sing5 - 5"]
          autocomplete(autoLists)
        }
      });

    });
  
  // 다른 곳 누르면 자동완성창과 결과창 토글형식으로 바꾸기
  $("section").on('click', function(e){
    $('#auto-box').hide();
    $('.swiper-wrapper').show()
  })

  if(window.player != null){
    window.player.onStateChange()
  }
  // 유튜브 슬라이드를 옮길때마다 제목과 가수 입력하고 현재 재생목록에 추가하기 
  // 함수는 appendSliders.js에 있음
  window.swiper.on('transitionEnd', function(e){
    setPlayer();
    setPlayerInfo();   
  });
});


