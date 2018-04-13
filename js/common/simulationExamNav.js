$(function(){
    initUserInfo();
});
function initUserInfo(){
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $("#exam_userName").text(data.name);
    var className = localStorage.getItem("className");
    className = className.replace(/\"/g,"");
    $("#exam_userClass").text(className);
    $(".number").text(data.nameNum);
    console.log(data);
    if (null == data.photo || "" == data.photo) {
		$(".exam_photo").attr("src","../../images/common/l-meb-icon.png")
    } else {
        $(".exam_photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
}