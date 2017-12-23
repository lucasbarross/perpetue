$(document).ready(function(){
    
    $("#returner").on('click', function(event){
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    })

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

    $("#sender").on('submit', function(event){
        event.preventDefault();
        var btnSend = $("#btn_send");
        btnSend.addClass('loading');
        $("#response").css("display", "none");

        function showError(err){
            $("#response").css("display", "block");
            $("#response").html(
            '<div class="ui error message">'+
                '<div class="header">Error!</div>'+
                '<p>'+err+'</p>'+
            '</div>')
        }

        function showMessage(msg){
            console.log(msg);
            var date = new Date();
            var today =  date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
            var message = msg.message;
            var avatar = msg.avatar;
            var author = msg.randomName;

            $(".posts").prepend(
                '<div class="post">'+
                    '<div class="avatar">'+
                        '<img src="'+avatar+'">'+
                    '</div>'+
                    '<div class="info">'+
                        '<p><strong>'+ author +'</strong> says:</p>'+
                        '<p>'+ message +'</p>'+
                        '<div class="date">'+ today +'</div>'+
                    '</div>'+
                '</div>'
            )
        }

        $(this).ajaxSubmit({
            success: function(res){
                if(res.responseCode != 0){
                    showError(res.responseDesc);
                } else{
                    showMessage(res);
                }
                btnSend.removeClass('loading');
                grecaptcha.reset();
                $("#message").val("");
                $("#charCounter").text($("#charCounter").attr("maxlength"));
            }
        })
    })

    var canLoad = true;
    
    $(window).scroll(function() {

        if($(window).scrollTop() < 50){
            $("#returner").css("display", "none");
        } else{
            $("#returner").css("display", "block");
        }

        if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && canLoad) {
            loadMore();
        }
    });

    function loadMore(){   
        var lastId = getLastId();
        canLoad = false;
        $.ajax({
            url: '/posts/load?from='+lastId,
            type: 'GET',
            success: function(data){
                if(data.responseCode != 0){
                    alert("Couldn't load more posts.");
                } else{
                    var container = $(".posts");
                    data.posts.forEach(function(post){
                        var date = new Date(post["date"]);
                        container.append(
                            '<div data-id="'+ post["_id"] +'" class="post">'+
                                '<div class="avatar">'+
                                    '<img src="' + post["avatar"] + '">' +
                                '</div>'+
                                '<div class="info">'+
                                    '<p><strong>'+ post["author"] + '</strong> says:</p>' +
                                    '<p>'+ post["body"] + '</p>' +
                                    '<div class="date">' + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + '</div>'+
                                '</div>'+
                            '</div>'
                        )
                    }) 
                    canLoad = true;
                }
            }
        })
    }

    function getLastId(){
        return $(".posts").children().last().data('id');
    }
})