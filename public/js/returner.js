$(document).ready(function(){
    $("#returner").on('click', function(event){
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    })

    $(window).scroll(function() {
        if($(window).scrollTop() < 50){
            $("#returner").css("display", "none");
        } else{
            $("#returner").css("display", "block");
        }
    });
})