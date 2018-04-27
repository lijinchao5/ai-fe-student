$(function () {
    //获取用户信息
    var data = JSON.parse(store.get("userInfo"));
    $("#username1").text(data.name);
    if (data.name == "" || data.name == null) {
        $("#username1").text("尚未设置昵称").css("font-size", "16px")
    }
    $("#studentNum").text(data.nameNum);
    if (null == data.photo || "" == data.photo) {
        $("#photo1").attr("src","../../images/common/l-meb-icon.png")
    } else {
        $("#photo1").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
});

//  导航添加current类名
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