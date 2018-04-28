$(function () {
    initUserInfo();
});

function initUserInfo() {
    console.log(data);
    var data = JSON.parse(store.get("userInfo"));
    if (null == data.photo || "" == data.photo) {
        $(".exam_photo").attr("src", "../../images/common/l-meb-icon.png")
    } else {
        $(".exam_photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
    var className = store.get("className");
    $(".exam_userClass").text(className);
    $(".number").text(data.nameNum);
    $(".exam_userName").text(data.name);
    if (data.name == "" || data.name == null) {
        $(".exam_userName").text("尚未设置昵称").css("font-size", "16px")
    }
    className = className.replace(/\"/g, "");
}