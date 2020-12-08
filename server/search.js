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
  window.swiper.removeAllSlides()
  window.player = null;

  //  검색창에 키 입력시 자동완성 입력
  $(".search-bar").keyup(function (e) {
      if(!$('#auto-box').is(":visible")){
        $('#auto-box').show()
        $('.swiper-wrapper').hide()
      }
      // 자모음 분리
      var splitInput = Hangul.disassemble($("#txt-search").val());
      var joinedInput = splitInput.join("").replace(" ","");
      console.log(joinedInput)
      var autoParam = { name: joinedInput }

      //비동기 처리(자동완성할 데이터 가져오기)
      getAutocompletList(autoParam)
    });

  // x버튼 클릭시 제목 초기화
  $(".cancel-btn").click(function(e){
    $("#txt-search").val("");
  })
  
  // 서치 바 클릭시 제목 초기화
  $(".search-bar").click(function(e){
    $("#txt-search").val("");
  })
  
  // 다른 곳 누르면 자동완성창과 결과창 토글형식으로 바꾸기
  $("section").on('click', function(e){
    $('#auto-box').hide();
    $('.swiper-wrapper').show()
  })

  // 현재 재생 상태를 확인하고 클릭한 유튜브가 있을경우 그쪽으로 이동
  if(window.player != null){
    window.player.onStateChange()
  }

  // 유튜브 슬라이드를 옮길때마다 제목과 가수 입력하고 현재 재생목록에 추가하기 
  // 함수는 appendSliders.js에 있음
  window.swiper.on('transitionEnd', function(e){
    setPlayer();
    setPlayerInfo();   
  });

  // controller 
  $(".play-btn").click(changePlayerState)

  // time slider 구현하기
  var isMouseDown = true;
  $(".seek-bar").click(changeProgress);

  
  setInterval(updateProgress,100)
    

  function changePlayerState(e){
    console.log(e)
    //$(".play-btn").class
    if(youTubePlayerState(window.player)==1){
      youTubePlayerPause(window.player);
      $(".fas.fa-pause").removeClass('fa-pause').addClass('fa-play');
    }else{
      youTubePlayerPlay(window.player);
      $(".fas.fa-play").removeClass('fa-play').addClass('fa-pause')
    }
  }
  
  function changeProgress(e){
    console.log("a")
      if(isMouseDown){
        var width = this.clientWidth;
        var clickX = e.offsetX
        var current_percent = clickX/width*100
        $(".seek-fill").css("width", current_percent+"%")
        youTubePlayerCurrentTimeChange(current_percent)
        youTubePlayerPlay(window.player)
        $(".fas.fa-play").removeClass('fa-play').addClass('fa-pause')
      }
  }

  function updateProgress(){
    if(window.player && youTubePlayerState(window.player)==1){
      var currenPercent = youTubePlayerPercent(window.player)
      $(".seek-fill").css("width", currenPercent+"%")
    }
  }
  


})

