$(document).ready(function(){
    var feedback = new Feedback();
    
    $("#sender").on('submit', function(event){
        event.preventDefault();
        var btnSend = $("#btn_send");
        btnSend.addClass('loading');
        $("#response").css("display", "none");

        $(this).ajaxSubmit({
            success: function(res){
                if(res.responseCode != 0){
                    feedback.showError(res.responseDesc, "#response");
                } else{
                    var message = $(feedback.messageModel(res, "comment", res.maxReports));
                    $(".posts").prepend(message);
                }

                btnSend.removeClass('loading');
                $("#message").val("");
                $("#charCounter").text($("#charCounter").attr("maxlength"));
                grecaptcha.reset(senderWidget);
            }
        })
    })
})