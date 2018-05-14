$(function () {
    $('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#footer').load('../common/footer.html');

    console.log(1212);
    initInfo();
    console.log(2121);
});
function changeClass() {
    $(".class-list").toggle()
}
function initInfo() {
    var getId=getParam("id");
    var classId = getId;
    var url = "studentClass/getClassmate.do?classId="+classId;
    doAjax("get", url, null, function(data, code) {
        console.log(data)
        if (null == data || data.length <= 0) {
            console.log("没有同学")
        } else {
            var parent = $(".classmateList");
            parent.html("");
            for(var i=0;i<data.length;i++){

                var html = '<li class="item" index="'+data[i].id+'">';
                if (null == data[i].photo || "" == data[i].photo) {
                    html+='<img src="../../images/common/l-meb-icon.png" class="item-icon">';
                }else {
                    html+='<img src="'+getRootPath() + "file/download.do?type=jpg&id=" +data[i].photo+'" class="item-icon">';
                }
                if(null==data[i].NAME||"" == data[i].NAME){
                    html+='<p class="item-txt">未设置昵称</p>';
                }else{
                    html+= '<p class="item-txt">'+data[i].NAME+'</p>';
                }

                html+="</li>";
                parent.append(html);
            }
        }
    });
}