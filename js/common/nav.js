$(function () {
    //获取用户信息
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $("#username1").text(data.name);
    $("#studentNum").text(data.nameNum);
    if (null == data.photo || "" == data.photo) {

    } else {
        $("#photo1").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
});

//        导航添加current类名
var currents = $("#details-nav a").length;
var currentEl = $("#details-nav a");
if (sessionStorage.element) {
    currentEl.eq(sessionStorage.element).addClass("current");
    currentEl.eq(sessionStorage.element).find("img").attr("src", "../../images/common/nav" + sessionStorage.element + "-in" + ".png");
} else {
    currentEl.eq(0).addClass("current");
    currentEl.eq(0).find("img").attr("src", "../../images/common/nav0-in.png");
}

currentEl.click(function () {
    sessionStorage.element = $(this).index();
});

function hrefPerson() {
    window.location.href="../personInfo/personInfo.html"
}