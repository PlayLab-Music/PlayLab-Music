$(document).ready(function(){
    // 스크롤 업
    $("*").animate({scrollTop: 0}, 1);

    function stars(){
        var windowWidth = $(window).width();

        var count = 30;
        if(windowWidth >= 768){
            count = 100;
        }
        var scene = $(".container").get(0)
        var i = 0;
        while(i<count){
            var star = document.createElement("i");
            var x = Math.floor(Math.random() * window.innerWidth);
            var y = Math.floor(Math.random() * window.innerHeight);
            var duration = Math.random() * 10;
            var size = Math.random() * 2;

            star.style.left = x+"px"
            star.style.top = y+"px"
            star.style.width = 1+size+"px"
            star.style.height = 1+size+"px"
            star.style.animationDuration = 5 + duration + 's'
            star.style.animationDelay = duration + 's'
            star.style.zIndex = 1

            scene.appendChild(star);
            i++;
        }
    }
    stars();

    // $("*").scroll(function(){
    //     var curY = this.scrollTop
    //     var main = $(".container").get(0)
    //     main.style.backgroundPosition = `-${curY * .25}px 0px`
    
    //     var navbar = $(".navbar").get(0);
    //     navbar.classList.toggle("sticky", curY > 0);
    // });

    // $("input").keydown(function(e){
    //     console.log(e);
    //     $("input").caret(0)
    // })
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


           
    // var elm = "section";
    // $(elm).each(function (index) {
        
    //     // 개별적으로 Wheel 이벤트 적용
    //     $(this).on("mousewheel DOMMouseScroll", function (e) {
    //         // e.preventDefault();
    //         var delta = 0;
    //         // if (!e) e = window.event;
    //         if (e.originalEvent.wheelDelta) {
    //             delta = e.originalEvent.wheelDelta / 120;
    //             if (window.opera) delta = -delta;
    //         }else if (e.detail)
    //             delta = -e.detail / 3;
            // var moveTop = $(window).scrollTop();
            // 마우스휠을 위에서 아래로
            // if (delta < 0) {
            //     if ($(this).next() != undefined) {
            //         try{
            //             moveTop = $(this).next().get(0).offsetTop;
            //         }catch(e){}
            //     }
            // // 마우스휠을 아래에서 위로
            // } else {
            //     if ($(this).prev() != undefined) {
            //         try{
            //             moveTop = $(this).prev().get(0).offsetTop;
            //         }catch(e){}
            //     }
            // }
            //화면 이동 0.8초(800)
            // $("*").stop().animate({scrollTop: moveTop}, 100, function () {
            //     console.log("e")
            // });
    //     });
    // });