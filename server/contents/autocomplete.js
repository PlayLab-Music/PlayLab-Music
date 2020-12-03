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
                var selectedTxt = $(this).text();
                $("#TxtSearch").val(selectedTxt);
                clearAll()
                
            })
            
        }
    }

}