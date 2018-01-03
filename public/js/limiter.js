$(document).ready(function(){
    $("#message").on('input', function(event){
        var textArea = $(this);
        var limit = textArea.attr("maxlength");
        var remainingChars = limit - textArea.val().length;
        if(remainingChars < 0){
            textArea.val(textArea.val().substr(0, limit));
            remainingChars = 0;
        }
        $("#charCounter").text(remainingChars);
    })
})