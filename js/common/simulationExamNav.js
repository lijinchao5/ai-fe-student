$(function(){
    initUserInfo();
});
function initUserInfo(){
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $("#exam_userName").text(data.name);
    $("#exam_userClass").text(data.classId);
    $(".number").text(data.nameNum);
    console.log(data);
    if (null == data.photo || "" == data.photo) {
    } else {
        $(".exam_photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
}