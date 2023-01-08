$(document).ready(function () {
    $(function(){
        var current = location.pathname;
        console.log(current);
        $('.navbar-nav li a').each(function(){
            var $this = $(this);
            // if the current path is like this link, make it active
            if($this.attr('href') === current){
                //.indexOf(current) !== -1
                $this.addClass('active');
            }
        })
    });
});