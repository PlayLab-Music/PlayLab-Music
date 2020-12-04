function autocomplete(sugLists){
    //input     arr   '["a-b","c-d"]'
    //return    li.appendTo('auto-box') 
    function clearAll(){
        if($(".auto-active")){
            $(".auto-active").remove()
        }
    }
    clearAll()

    if(sugLists){
        for(var i in sugLists){
            console.log(sugLists[i])
            var suggestItem = '<li class="auto-active" value="'+ sugLists[i] +'">'+ sugLists[i] + '</li>'
            var suggestTag = $(suggestItem)
            suggestTag.appendTo($("#auto-box"))
            suggestTag.click(function(e){
                clearAll()
                var selectedTxt = $(this).text();
                $("#TxtSearch").val(selectedTxt);
                var searchInput = $("#TxtSearch").val()
                // 자모음 분리로 db검색후 반환
                var dbInfos;
                var autoLists;
                
                // 함수구현
                
                var param = {name: searchInput}
                $.ajax({
                    type: 'POST',
                    url: './2.php',
                    data: param,
                    dataType: 'json',
                    success: function(data){
                            appendContents(data);
                    },
                    error: function(){
                    dbInfos = [["bqfOALK0qnc","0","1"],["GP5t5ZYfgZw","1","1"],["XSj14Bg3cPE","2","2"],["JBMpAOuDLbg","3","3"], ["O1JUyyNHROc","4","4"],["X_sR3nyL-q8","5","5"], ["7kII76zHLRg","6","6"], ["LvANkO6Wfjc","7","7"], ["GHb5ox62bKM","8","8"]]
                    appendContents(dbInfos)
                    }
                });
          
                
            })
            
        }
    }

}