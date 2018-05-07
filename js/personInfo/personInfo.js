$(function () {
    $('#header').load('../../html/common/header.html');
    $('#footer').load('../../html/common/footer.html');
    $("#birthDate").attr('placeholder', '年月日（例：20120105）');
    $("#user_name").attr('placeholder', '请输入2到6个字符');
    $("#sexSelect .boys img").attr("src", "../../images/personInfo/sex0-in.png");
    $("#sexSelect .girls img").attr("src", "../../images/personInfo/sex1.png");
});

function index() {
    window.location.href = "../index.html";
}

// tab 切换
function navs() {
    var navsTab = $('#details-nav span');

    navsTab.click(function () {
        $(this).addClass('current').siblings().removeClass('current');
        tabsindex = $(this).index();
        $('#tabbd >li').hide().eq(tabsindex).show();
    });
}
navs();
// 切换男女
function chSex(index) {
    if (index == 0) {
        $('#sexSelect span:eq(' + index + ')').css('color', '#333').find('img').attr('src', '../../images/personInfo/sex0-in.png');
        $('#sexSelect span:eq(' + index + ')').siblings().css('color', '#999').find('img').attr('src', '../../images/personInfo/sex1.png');
        $("#sex").val("M")
    } else if (index == 1) {
        $('#sexSelect span:eq(' + index + ')').css('color', '#333').find('img').attr('src', '../../images/personInfo/sex1-in.png');
        $('#sexSelect span:eq(' + index + ')').siblings().css('color', '#999').find('img').attr('src', '../../images/personInfo/sex0.png');
        $("#sex").val("W");
    }
}

$('#sexSelect span').click(function () {
    var indax = $(this).index();
    chSex(indax)
});

// 绑定手机 更改密码部分切换
function togg(ex1, ex2) {
    $(ex1).click(function () {
        $(ex2).toggle();
    })
}
togg('.toggle-phone', '.change-phone');
togg('.toggle-pwd', '.change-pwd');

$(function () {
    var uuid = new UUID();
    store.set("uuid", uuid.id);
    randomPic();
    var data = JSON.parse(store.get("userInfo"));

    if (null == data.photo || "" == data.photo) {
        $("#photo1").attr("src", "../../images/common/l-meb-icon.png");
        $("#photo2").attr("src", "../../images/common/l-meb-icon.png");
    } else {
        $("#photo1").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo);
        $("#photo2").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo);
    }

    $("#studentNum").text(data.nameNum);
    $("#user_name").val(data.name);
    // 没有更改名字时
    $("#username1").text(data.name);
    if (data.name == "" || data.name == null) {
        $("#username1").text("尚未设置昵称").css("font-size", "16px")
    }
    $("#mobiles").text(data.mobile);
    if (data.sex && data.sex == 'M') {
        chSex(0);
    } else {
        chSex(1);
    }
    if (data.birthDate) {
        if (null == data.birthDate || data.birthDate == '') {
            return "19901001";
        }
        var date = new Date(data.birthDate);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var birth = y + (m < 10 ? ('0' + m) : '' + m) + (d < 10 ? ('0' + d) : '' + d);
        $("#birthDate").val(birth)
    }
    $("#second-disable").selectpicker({
        noneSelectedText: '请选择'
    });
    $("#third-disabled").selectpicker({
        noneSelectedText: '请选择'
    });
    $("#forth-disable").selectpicker({
        noneSelectedText: '请选择'
    });
    // 获取班级等信息
    getStudentInfo();
    initSelectChange();
});

$("#sure-change").click(function () {
    var url = "class/updateClass.do";
    var clasId = $("#classId").val();
    var param = {};
    param.clasId = clasId;
    doAjax("post", url, param, function (data, code) {
        if (code == "0" || code == 0) {
            $(".change-tips").css("display", "none");
            $("#myModal").modal('hide');
            $("#school4").val(param.clasId);
        } else {
            $(".change-tips").css("display", "block");
        }
    })
});

function getStudentInfo() {
    var url = "user/getStudentInfo.do";
    doAjax("get", url, null, function (user) {
        $("#region1").val(user.address_province);
        $("#region2").val(user.address_city);
        $("#region3").val(user.address_area);
        $("#school1").val(user.schoolName);
        if (user.mobile == null) {
            $("#school5").val("您还没有绑定手机号");
            $(".phone-tips").text("绑定成功");
            $(".tips-of-change").text("下次登录可使用手机号登录");
        } else {
            $("#school5").val(user.mobile);
            $("#phoneNum").css("background-color", " #11d8fc");
            $(".link-phone").text("更换手机");
            $(".link-phone-info").text("更换后原号码" + user.mobile + "不能提供登录和找回密码服务");
            $(".phone-tips").text("更改成功");
            $(".tips-of-change").text("下次登录可使用新手机号登录")
        }
        $("#school6").val(user.bookVersion);
        if (user.name_num == null) {
            $("#school7").val("您还没有绑定个人账号")
        } else {
            $("#school7").val(user.name_num)
        }
        //store.set("className", user.grade + user.className);
        var localUser = JSON.parse(store.get("userInfo"));
        initSelect(user, localUser);
    });
}
// 图片验证码
function randomPic() {
    var uuid = store.get("uuid");
    // localhost:8092/picture.do?type=2&randomKey=123
    $("#randomPic").attr("src", getRootPath() + "picture.do?type=2&randomKey=" + uuid + "&t=" + new Date().getTime());
}
function sendMessage() {
    var uuid = store.get("uuid");
    var url = "mobileMessage/registMsg.do";
    var param = {};
    param.randomKey = uuid;
    param.randomStr = $("#randomValue").val();
    param.mobile = $("#newMobile").val();
    doAjax("get", url, param, function (data, code) {
        if (code != 0) {
            $(".phone-warms").css("display", "block").text(message);
        }
    });
}
// 更换手机号
function updateMobile() {
    var uuid = store.get("uuid");
    var url = "user/updateMobile.do";
    var param = {};
    param.mobileRandomKey = uuid;
    param.password = $("#password1").val();
    param.newMobile = $("#newMobile").val();
    param.mobileRandomStr = $("#messageValue").val();
    doAjax("post", url, param, function (data, code, message) {
        if (code == '0' || code == 0) {
            $(".change-phone").modal("show");
            // window.location.reload();
            $(".phone-warms").css("display", "none")
        } else {
            $(".phone-warms").css("display", "block").text(message);
        }
    });
}

// 更换密码
function updatePassword() {
    var url = "user/updatePassword.do";
    var param = {};
    param.oldPassword = $("#password2").val();
    param.newPassword = $("#password3").val();
    doAjax("post", url, param, function (data, code, message) {
        if (code == '0' || code == 0) {
            $(".bs-example-modal-sm").modal("show");
            $(".pwd-warms").css("display", "none")
        } else {
            $(".pwd-warms").css("display", "block").text(message);
        }
    });
}

// 获取用户信息
function reloadUserInfo() {
    var url = "user/getUserInfo.do";
    doAjax("get", url, null, function (user) {

        if (null == user.name || "" == user.name) {
            if (null == user.mobile || "" == user.mobile) {
                user.name = user.userName;
            } else {
                user.name = user.mobile;
            }
        }
        store.set("userInfo", JSON.stringify(user));
        window.location.reload();
    });
}

$("#user_name").blur(function () {
    var userName = $.trim($("#user_name").val());
    if (userName == '') {
        $(".name-tips").css("display", "block");
        $(".sure").attr("disabled", true);
    } else {
        // $(".name-tips").css("display", "none");
        $(".sure").attr("disabled", false);
    }
});

// 更改个人信息
function subUserInfo() {
    var url = "user/updatePersionalInfo.do";
    var param = {};
    param.name = $("#user_name").val();
    param.sex = $("#sex").val();
    var birth = $("#birthDate").val();
    var reg = /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
    var regExp = new RegExp(reg);
    if (!regExp.test(birth)) {
        console.log(birth)
        $(".name-tips").text("日期格式不正确，正确格式为：20140101");
        return false;
    } else {
        console.log("ok");
        $(".name-tips").text("");
        $('#suremsg').modal('show')
    }
    var y = birth.substring(0, 4);
    var m = birth.substring(4, 6);
    var d = birth.substring(6, 8);
    // alert(y+"-"+m+"-"+d);
    param.birthDate = y + '-' + m + '-' + d;
    doAjax("post", url, param, function (data, code, message) {
        if (code == '0' || code == 0) {
            // reloadUserInfo();
            $("#sexSelect").find("span img").attr("src", "");
            $("#birthDate").attr('placeholder', '');
            $("#user_name").attr('placeholder', '');
        } else {
            $(".name-tips").text(message);
        }
    });
}
// 更改学校信息
function subSchoolInfo() {
    var url = "user/updatePersionalInfo.do";
    var param = {};
    // 学校Id
    param.schoolId = $("#forth-disabled").selectpicker("val");
    // 年级
    param.grade = $("#fifth-disabled").selectpicker("val");
    // 教材版本
    param.bookVersion = $("#sixth-disabled").selectpicker("val");
    doAjax("post", url, param, function (data, code, message) {
        if (code == '0' || code == 0) {
            reloadUserInfo();
        } else {
            alert(message);
        }
    });
}

// 更换头像 图片
function uploadImg1() {
    var param = {};
    param.img = src;
    param.jid = $('#jid').val();
    doAjax("post", url, param, function (data, code) {
        if (code == '0' || code == 0) {
            reloadUserInfo();
            alert("操作成功!");
            // window.location.reload();
        }
    });
}

function imgOnChange() {
    var src = window.URL.createObjectURL(document.getElementById('picImgFile').files[0]);
    document.getElementById('preImg').src = src;
    document.getElementById('preImg-big').src = src;
    document.getElementById('preImg-mid').src = src;
    document.getElementById('preImg-sml').src = src;
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mimeString
    });
}

function run(input_file, get_data) {
    if (typeof (FileReader) === 'undefined') {
        alert("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");
    } else {
        try {
            var file = input_file.files[0];
            if (!/image\/\w+/.test(file.type)) {
                alert("请确保文件为图像类型");
                return false;
            }
            var reader = new FileReader();
            reader.onload = function () {
                get_data(this.result);
            };
            reader.readAsDataURL(file);
        } catch (e) {
            alert('图片转Base64出错啦！' + e.toString())
        }
    }
}

// 做个下简易的验证 大小 格式
$('#avatarInput').on('change', function (e) {
    var filemaxsize = 1024 * 5;// 5M
    var target = $(e.target);
    var Size = target[0].files[0].size / 1024;
    if (Size > filemaxsize) {
        alert('图片过大，请重新选择!');
        $(".avatar-wrapper").children().remove;
        return false;
    }
    if (!this.files[0].type.match(/image.*/)) {
        alert('请选择正确的图片!')
    } else {
        var filename = document.querySelector("#avatar-name");
        var texts = document.querySelector("#avatarInput").value;
        var teststr = texts; // 你这里的路径写错了
        testend = teststr.match(/[^\\]+\.[^\(]+/i); // 直接完整文件名的
        filename.innerHTML = testend;
    }
});

function uploadImg() {
    var img_lg = $('#resultImg');
    // 截图小的显示框内的内容
    html2canvas(img_lg, {
        allowTaint: true,
        taintTest: false,
        onrendered: function (canvas) {
            canvas.id = "mycanvas";
            // 生成base64图片数据
            var dataUrl = canvas.toDataURL("image/jpeg");
            var newImg = document.createElement("img");
            newImg.src = dataUrl;
            imagesAjax(dataUrl)
        }
    });
}

function imagesAjax(src) {
    var param = {};
    param.picfile = src;
    var url = "user/updatePersionalInfo.do";
    doAjax("post", url, param, function (data, code) {
        if (code == '0' || code == 0) {
            alert("操作成功!");
            reloadUserInfo();
        }
    });
}
$(function () {
    // 自动触发 编辑头像的 移动事件
    $(".avatar-wrapper").hover(function () {
        $(".fa-arrows").click();
    })
});
// 联动
function selectLoadData(id, data, selectId) {
    if (null == data || data.length <= 0) {
    } else {
        var select1 = $("#" + id);
        for (var i = 0; i < data.length; i++) {
            select1.append("<option value='" + data[i].code + "'>" + data[i].text + "</option>");
        }
        select1.selectpicker('refresh');
        if (selectId && selectId != null) {
            select1.selectpicker("val", selectId)
        }
        select1.selectpicker('render');
    }
}

function selectSchoolData(id, data, selectId) {
    if (null == data || data.length <= 0) {
    } else {
        var select1 = $("#" + id);
        for (var i = 0; i < data.length; i++) {
            select1.append("<option value='" + data[i].id + "'>" + data[i].schoolName + "</option>");
        }
        select1.selectpicker('refresh');
        if (selectId && selectId != null) {
            select1.selectpicker("val", selectId)
        }
        select1.selectpicker('render');
    }
}
// 教材版本
function selectTeachData(id, data, selectId) {
    if (null == data || data.length <= 0) {
    } else {
        var select1 = $("#" + id);
        for (var i = 0; i < data.length; i++) {
            select1.append("<option value='" + data[i].nameVal + "'>" + data[i].name + "</option>");
        }
        select1.selectpicker('refresh');
        if (selectId && selectId != null) {
            select1.selectpicker("val", selectId)
        }
        select1.selectpicker('render');
    }
}
function initSelect(userInfo, localUser) {
    doAjax("get", "area/getRegion.do?level=1", null, function (data, code) {
        if (null == data || data.length <= 0) {
        } else {
            selectLoadData("first-disabled", data, userInfo.address_province)
            if (null == userInfo.address_province || userInfo.address_province == "") {
                // if(null == userInfo.bookVersion || userInfo.bookVersion ==
                // ""||userInfo.bookVersion == "其他"){
                $("#first-disabled").selectpicker("val", "0")
                $("#first-disabled").selectpicker('render');
            }
            doAjax("get", "area/getRegion.do?regionId=" + userInfo.address_province, null, function (data, code) {
                selectLoadData("second-disabled", data, userInfo.address_city)
                doAjax("get", "area/getRegion.do?regionId=" + userInfo.address_city, null, function (data, code) {
                    selectLoadData("third-disabled", data, userInfo.address_area)
                    doAjax("get", "school/getSchoolByRegion.do?regionId=" + userInfo.address_area, null, function (data, code) {
                        selectSchoolData("forth-disabled", data, userInfo.schoolId)
                    });
                });
            });
        }
    });
    // 年级
    doAjax("get", "dic/findDicByType.do?type=4", null, function (data, code) {
        selectTeachData("fifth-disabled", data, localUser.gradeLevelId)
        doAjax("get", "dic/findDicByType.do?type=3", null, function (data, code) {
            selectTeachData("sixth-disabled", data, localUser.bookVersionId)
        });
    });
}

// 数据发生改变
function initSelectChange() {
    $('#first-disabled').on('change', function (data, index) {
        cleanSelectVal($("#second-disabled"));
        cleanSelectVal($("#third-disabled"));
        cleanSelectVal($("#forth-disabled"));
        doAjax("get", "area/getRegion.do?regionId=" + $(this).val(), null, function (data1, code) {
            selectLoadData("second-disabled", data1, null);
            doAjax("get", "area/getRegion.do?regionId=" + data1[0].code, null, function (data2, code) {
                selectLoadData("third-disabled", data2, null);
                doAjax("get", "school/getSchoolByRegion.do?regionId=" + data2[0].code, null, function (data3, code) {
                    selectSchoolData("forth-disabled", data3, null)
                });
            });
        });
    });
    $('#second-disabled').on('change', function (data, index) {
        cleanSelectVal($("#third-disabled"));
        cleanSelectVal($("#forth-disabled"));
        doAjax("get", "area/getRegion.do?regionId=" + $(this).val(), null, function (data2, code) {
            selectLoadData("third-disabled", data2, null);
            doAjax("get", "school/getSchoolByRegion.do?regionId=" + data2[0].code, null, function (data3, code) {
                selectSchoolData("forth-disabled", data3, null)
            });
        });
    });
    $('#third-disabled').on('change', function (data, index) {
        cleanSelectVal($("#forth-disabled"));
        doAjax("get", "school/getSchoolByRegion.do?regionId=" + $(this).val(), null, function (data, code) {
            selectSchoolData("forth-disabled", data, null)
        });
    });
    $('#fifth-disabled').on('change', function (data, index) {
        cleanSelectVal($("#sixth-disabled"));
        doAjax("get", "dic/getBookVersion.do?grade=" + $(this).val(), null, function (data, code) {
            selectTeachData("sixth-disabled", data, null)
        });
    });
}

// 清除改变前的数据
function cleanSelectVal(selector) {
    selector.find('option').remove();
    selector.selectpicker('refresh');
}
