$(function(){
    initUserInfo();
});
function initUserInfo(){
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $(".exam_userName").text(data.name);
    $(".number").text(data.nameNum);
    if (null == data.photo || "" == data.photo) {
    } else {
        $(".exam_photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
}