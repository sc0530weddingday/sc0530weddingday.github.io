
$(document).ready(function () {

    // rwd按鈕
    $('.hamburger').click(function (e) {
        $(this).toggleClass('active');
        $('.logo img').toggleClass('phone-logo');
        // $('.nav-bg').toggleClass('phone-nav-bg');
    });

    // header 滑動效果
    var lastScrollTop = 0; // 記錄上一次滾動位置

    $(window).on("scroll", function () {
        var st = $(this).scrollTop();

        if (st > lastScrollTop) {
            // 往上滑，加上 .scroll
            $("header").addClass("scroll");
        } else {
            // 往下滑，移除 .scroll
            $("header").removeClass("scroll");
        }

        lastScrollTop = st;
    });

});