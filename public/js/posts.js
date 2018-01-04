
$(document).ready(function(){
    var feedback = new Feedback();
    $(".loader").hide();
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
                    var message = $(feedback.messageModel(res, "post", res.maxReports));
                    $(".posts").prepend(message);
                }

                btnSend.removeClass('loading');
                $("#message").val("");
                $("#charCounter").text($("#charCounter").attr("maxlength"));
                grecaptcha.reset(senderWidget);
            }
        })
    })

    var canLoad = true;
    
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && canLoad) {
            loadMore();
        }
    });

    var reachedAll = false;
    function loadMore(){   
        var lastId = getLastId();
        if(!reachedAll){
            $(".loader").show();
        }
        canLoad = false;
        $.ajax({
            url: '/posts/load?from='+lastId,
            type: 'GET',
            success: function(data){
                if(data.responseCode != 0){
                    console.log(data)
                } else if(data.posts.length > 0){
                    var container = $(".posts");
                    data.posts.forEach(function(post){
                        var message = $(feedback.messageModel(post, "post", data.maxReports));
                        container.append(message) 
                    })
                } else{
                    reachedAll = true;
                }
                
                $(".loader").hide();
                canLoad = true;
            }
        })
    }
    function getLastId(){
        return $(".posts").children().last().data('id');
    }

    $('#refresh-button').on('click', function(e){
        $(this).animate({  borderSpacing: -360 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)'); 
              $(this).css('-moz-transform','rotate('+now+'deg)');
              $(this).css('transform','rotate('+now+'deg)');
            },
            duration:'slow'
        },'linear');
        
        
        canLoad = false;  
        var container = $(".posts");
        container.html("");
        $(".loader").show();

        $.ajax({
            url: '/posts/refresh',
            type: 'GET',
            success: function(data){
               $(".loader").hide();
                if(data.responseCode != 0){
                    console.log(data)
                } else if(data.posts.length > 0){
                    data.posts.forEach(function(post){
                        var message = $(feedback.messageModel(post, "post", data.maxReports));
                        container.append(message)
                    })
                    canLoad = true;   
                    reachedAll = false;
                }
            }
        })
    })
})