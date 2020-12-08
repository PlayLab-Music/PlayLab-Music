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
  window.isPlaying = false;

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
  $(".prev-btn").click(setPrevPlayer)
  $(".play-btn").click(changePlayerState)
  $(".next-btn").click(setNextPlayer)

  // time slider 구현하기
  var isMouseDown = true;
  $(".seek-bar").click(changeProgress);

  $("swiper-slide").click(function(e){console.log(e)})

  setInterval(updateProgress,100)



  function setPrevPlayer(e){
    if(youTubePlayerPercent(window.player) < 2){
      window.swiper.slidePrev(500)
    }else{
      youTubePlayerCurrentTimeChange(window.player, 0);
        youTubePlayerPlay(window.player);
        
    }
  }

  function setNextPlayer(e){
    window.swiper.slideNext(500)
  }

  function changePlayerState(e){
    console.log(e)
    //$(".play-btn").class
    if(youTubePlayerState(window.player)==1){
      youTubePlayerPause(window.player);
      togglePlayBtn("play")
    }else{
      youTubePlayerPlay(window.player);
      togglePlayBtn("pause")
    }
  }
  
  function changeProgress(e){
    console.log("a")
      if(isMouseDown){
        var width = this.clientWidth;
        var clickX = e.offsetX;
        var current_percent = clickX/width*100;
        $(".seek-fill").css("width", current_percent+"%");
        youTubePlayerCurrentTimeChange(window.player, current_percent);
        youTubePlayerPlay(window.player);
        togglePlayBtn("play");
      }
  }

  function updateProgress(){
    if(window.player && youTubePlayerState(window.player)==1){
      var currentPercent = youTubePlayerPercent(window.player);
      $(".seek-fill").css("width", currentPercent+"%");
      togglePlayBtn("play");
      console.log(currentPercent)
      //autoPlay(true, currentPercent);
    }else{
      togglePlayBtn("pause");
    }
  }
  

  function autoPlay(state, currentPercent){
    if(state==true){
      if(currentPercent>99.9){
        setNextPlayer()
        
      }
    }
  }

  function togglePlayBtn(toState){
    if(toState == "play"){
      $(".fas.fa-play").removeClass('fa-play').addClass('fa-pause');
      window.isPlaying = true;
    }else{
      $(".fas.fa-pause").removeClass('fa-pause').addClass('fa-play');
      window.isPlaying = false;
    }
  }
  window.swiper.on('transitionStart',function(){
    $(".seek-fill").css("width", "0%");
  })
})

