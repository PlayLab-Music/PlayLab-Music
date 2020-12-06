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
            var suggestItem = '<li class="auto-active" value="'+ sugLists[i] +'">'+ sugLists[i] + '</li>'
            var suggestTag = $(suggestItem)
            suggestTag.appendTo($("#auto-box"))
            suggestTag.click(function(e){
                clearAll()
                var selectedTxt = $(this).text();
                $("#txt-search").val(selectedTxt);
                var searchInput = $("#txt-search").val()
                
                // 자모음 분리로 db검색후 반환
                var param = {name: searchInput}
                getVideoData(param)                
            })
        }
    }
}