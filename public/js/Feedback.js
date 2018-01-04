function Feedback(){
    
    Feedback.prototype.showError = function(err, div){
        $(div).css("display", "block");
        $(div).html(
        '<div class="ui error message">'+
            '<div class="header">Error!</div>'+
            '<p>'+err+'</p>'+
        '</div>')
    }

    Feedback.prototype.messageModel = function(msg, type, maxReports){
        var date;
        if(msg["date"]){
            date = new Date(msg["date"]);
        } else {
            date = new Date();
        }
        var today =  date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
        var action = type == "post" ? '"/posts/'+ msg["hashid"] + '/report"' : '"/posts/'+ msg["hashid"] + '/comment/report"';
        var verb = type == "post" ? "says:" : "responds:";
        var message = ''; 
        
        if(type == 'post'){
            message += '<a href="/posts/' + msg["hashid"] + '/comments"' + 'data-id="' + msg['hashid'] +'" class="'+ type +'">'
        } else {
            message += '<div data-id="'+ msg['hashid'] + '" class="comment">'
        }
                            
         message+= '<div class="avatar">'+
                        '<img src="' + msg["avatar"] + '">' +
                    '</div>'+
                    '<div class="info">'+
                        '<p><strong>'+ msg["author"] + '</strong> '+verb+'</p>'

        if(msg["reports"] < maxReports) {
            message += '<p>'+ msg["body"] + '</p>'
        } else { 
            message += '<button data-target="#' + msg['hashid'] + 'msg" type="button" class="ui button basic toggle ">Show hidden message</button> <p style="display:none;" id="'+ msg['hashid'] + 'msg">'+msg["body"]+'</p>'
        } 

        message+= '<div class="date">' + today + '</div>';
        
        if(type == 'post'){
            if(msg["comments"])
                message+='<div class="comment-counter">' + msg["comments"].length + ' comment(s)</div>'
            else
                message+='<div class="comment-counter"> 0 comment(s)</div>'
        }

        if(!msg["reported"] || msg["reported"] == undefined){
            message+='<button'+ 
                        ' data-action='+action+
                        ' id="report_btn"'+
                        'data-id="'+msg['hashid']+
                        '" class="report report_btn">'+
                        '<i class="fa fa-exclamation" aria-hidden="true"></i>'+
                    '</button>'
        }
        message += '</div>'
        if(type == 'post'){
            message += '</a>'
        } else {
            message += '</div>'
        }
        return message;
    }
}