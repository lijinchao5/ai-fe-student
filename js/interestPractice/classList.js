$(function () {
    $('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#footer').load('../common/footer.html');
    inquireClass()
});

//“不了” 关闭弹窗
$(".without-footer .withdraw-refuse ").click(function () {
    $(".without-class").toggle();
});

//进入班级
function entryClass(id) {
    window.location.href = './myClass.html?id=' + id;
}


//退班按钮
function withdrawClass(id) {
    $(".without-class .without-body").html("确定要退出该班级吗，退出后将不能接受到该班级老师布置的作业或者考试，之前的作业和考试数据将会一起消失哦!<p class='add-notice'></p>");
    $(".without-class").toggle();
    $(".without-class .without-footer .withdraw-sure").attr("onclick", "exitClass(" + id + ")");
}

//退出班级
function exitClass(id) {
    var url = "studentClass/deleteStudentClass.do";
    var classId =id;
    var param = {};
    param.classId = classId;
    doAjax("post", url, param, function (data, code, message) {
        if (code == "0" || code == 0) {
            window.location.reload()
        } else {
            $(".add-notice").show().text(message);
        }
    })
}


//添加班级
function addNewclass() {
    var url = "studentClass/addStudentClass.do";
    var classId = $(".append-class").val();
    var param = {};
    param.classId = classId;
    doAjax("post", url, param, function (data, code, message) {
        if (code == "0" || code == 0) {
            $(".add-notice").hide();
            $(".without-class").toggle();
            window.location.reload()
        } else {
            $(".add-notice").show().text(message);
            $(".empty-tips").text(message)
        }
    })
}

//添加班级按钮
function addClass() {
    $(".without-class .without-body").html("<span>班级编号：</span><input class='append-class' placeholder='请输入你想加入的班级'><p class='add-notice'></p>");
    $(".without-class .without-footer .withdraw-sure").attr("onclick", "addNewclass()");
    $(".without-class").show();
}


//获取班级列表
function inquireClass() {
    var url = "studentClass/getStudentClass.do";
    var param = {};
    doAjax("get", url, param, function (data, code, message) {
        var _classWrap = $(".class-wrap");
        if (code == 0 || code == "0") {
            if (data.length == 0) {
                _classWrap.html("");
                var _emptyClass = "";
                _emptyClass = $("<div class='empty-class'>" +
                    "<p class='empty-title'>您还没有加入任何班级哦！</p>" +
                    "<p>输入班级编号，加入班级后，就可以看到老师布置的<span>作业</span>或者<span>考试</span>哦</p>" +
                    "<p><input type='text' placeholder='班级编号' class='append-class'><span class='empty-tips'></span></p>" +
                    "<p><button class='add-button' onclick=\"addNewclass()\">加入班级</button></p>" +
                    "<p>班级编号可以询问本班老师获取，如果本班老师还没有创建班级，</p>" +
                    "<p>那么你可以点击 <span class='blue'>趣听说</span> 去学习</p>" +
                    "</div>");
                _classWrap.append(_emptyClass)
            } else {
                for (var i = 0; i < data.length; i++) {
                    var _classList = "";
                    var d = data[i];
                    if (d.diss != null) {
                        _classList = $("<li id=" + d.id + "><p class='class-name' >" + d.grade + "年级" + d.name + "(" + d.classId + ")" + "</p>" +
                            "<p class='class-number'>" + d.totalStudent + "人</p>" +
                            "<p class='completed-work'>待完成作业</p>" +
                            "<p class='completed-work-text'><span class='finished-work'>" + d.complateHomework + "</span>/<span class='total-work'>" + d.totalHomework + "</span></p>" +
                            "<p class='completed-exam'>待完成考试</p>" +
                            "<p class='completed-exam-text'><span class='finished-exam'>" + d.complateExam + "</span>/<span class='total-exam'>" + d.totalExam + "</span></p>" +
                            "<p class='enter-class' onclick=\"entryClass(" + d.id + ")\">进入班级</p>" +
                            "<p class='withdraw-class' onclick=\"withdrawClass(" + d.id + ")\">退班</p>" +
                            "</li>");
                        _classWrap.append(_classList);
                    } else {
                        _classList = $("<li><p class='class-name' >" + d.grade + "年级" + d.name + "(" + d.classId + ")" + "</p>"  +
                            "<p class='class-number'>" + d.totalStudent + "人</p>" +
                            "<p class='completed-work'>待完成作业</p>" +
                            "<p class='completed-work-text'><span class='finished-work'>" + d.complateHomework + "</span>/<span class='total-work'>" + d.totalHomework + "</span></p>" +
                            "<p class='completed-exam'>待完成考试</p>" +
                            "<p class='completed-exam-text'><span class='finished-exam'>" + d.complateExam + "</span>/<span class='total-exam'>" + d.totalExam + "</span></p>" +
                            "<img src='../../images/myclass/class-disbanded.png' alt='解散班级' class='class-disbanded'></li>");
                        _classWrap.append(_classList);
                    }
                }
                var _addClass = "";
                _addClass = $("<li><img onclick=\"addClass()\" class='class-add' src='../../images/myclass/class-add.png' alt='添加班级'>" +
                    "<p class='add-text' onclick=\"addClass()\">添加更多</p>" +
                    "</li>");
                _classWrap.append(_addClass);
            }
        } else {}
    })
}