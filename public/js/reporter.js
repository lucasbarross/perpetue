var onloadCallback = function() {
    senderWidget = grecaptcha.render('btn_send',
    {
        'sitekey' : '6LeQFT4UAAAAAFNTWgBKdCXXsQAzbwRH2A0mTeJV',
        'callback': function(response){
            $('#sender').submit();
        },
        'badge': 'inline'
    })

    reportWidget = grecaptcha.render('captcha_report',
    {
        'sitekey' : '6LeQFT4UAAAAAFNTWgBKdCXXsQAzbwRH2A0mTeJV',
        'callback': function(response){
            $('#reporter').submit();
        },
        'badge': 'inline'
    })
};      

$(document).ready(function(){
    var reportBtn;

    $(document).on('click', '.report_btn', function(event){
        event.preventDefault();
        reportBtn = $(this);
        let id = reportBtn.data("id");
        let action = reportBtn.data("action")
        $("#reporter").attr('action', action);
        $("#captcha_report").click();
    })

    $(document).on('submit', '#reporter', function(event){
        event.preventDefault();
        var reporter = this;
        alertify.confirm("Are you sure you want to report this comment?", function () {
            $(reporter).ajaxSubmit({
                success: function(res){
                    if(res.responseCode == 0 && reportBtn != null){
                        reportBtn.remove();
                        reportBtn = null;
                    }
                    grecaptcha.reset(reportWidget);
                    alertify.alert(res.responseDesc);
                     $(reporter).find(".report_btn").css('display', 'none');
                }
            })
        }, function() {
            return;
        });    
    })
})