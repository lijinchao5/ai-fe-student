$(function () {
    //获取用户信息
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $("#username").text(data.name);
    if (null == data.photo || "" == data.photo) {
    } else {
        $("#photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }

    //百度统计
    var _hmt = _hmt || [];

    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?97575344e8fa059fb7b15ccda6cfcab9";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);

});
function logout() {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("X-AUTH-TOKEN");
    window.location.href = getLoginPath();
}


