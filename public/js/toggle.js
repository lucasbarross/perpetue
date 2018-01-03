$(document).on('click', '.toggle', function(e){
    e.preventDefault();
    $(this).toggle();
    var target = $(this).data('target');
    $(target).toggle();
})