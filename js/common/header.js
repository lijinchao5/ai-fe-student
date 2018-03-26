$(function () {
    //获取用户信息
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $("#username").text(data.name);
    if (null == data.photo || "" == data.photo) {
    } else {
        $("#photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
});
function logout(){
    localStorage.removeItem("userInfo");
    localStorage.removeItem("X-AUTH-TOKEN");
    window.location.href = getLoginPath();
}
