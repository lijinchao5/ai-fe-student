$(function () {
    initUserInfo();
});
function initUserInfo() {
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $(".exam_userName").text(data.name);
    if (data.name == "" || data.name == null) {
        $(".exam_userName").text("尚未设置昵称").css("font-size", "16px")
    }
    var className = localStorage.getItem("className");
    className = className.replace(/\"/g, "");
    $(".exam_userClass").text(className);
    $(".number").text(data.nameNum);
    console.log(data);
    if (null == data.photo || "" == data.photo) {
        $(".exam_photo").attr("src", "../../images/common/l-meb-icon.png")
    } else {
        $(".exam_photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
}