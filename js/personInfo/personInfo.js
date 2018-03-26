$(function () {
    $('#header').load('../../html/common/header.html');
    $('#background').load('../../html/common/background.html');
});
// tab 切换
function navs() {

    var navsTab = $('#tabhd span');
    var navLens = navsTab.length;
    navsTab.click(function () {
        $(this).addClass('current').siblings().removeClass('current');
        for (var i = 0; i < navLens; i++) {
            navsTab.eq(i).find('img').attr('src', '../../images/personInfo/tabs' + i + '.png')
        }
        tabsindex = $(this).index();
        navsTab.eq(tabsindex).find('img').attr('src', '../../images/personInfo/tabs' + tabsindex + '-in.png');
        $('#tabbd li').hide().eq(tabsindex).show();
    });
}
navs();

// 切换男女
function chSex(index) {
    if (index == 0) {
        $('#sexSelect span:eq(' + index + ')').find('img').attr('src', '../../images/personInfo/sex0-in.png');
        $('#sexSelect span:eq(' + index + ')').css('color', '#333');
        $('#sexSelect span:eq(' + index + ')').siblings().css('color', '#999');
        $('#sexSelect span:eq(' + index + ')').siblings().find('img').attr('src', '../../images/personInfo/sex1.png');
        $("#sex").val("M")
    } else if (index == 1) {
        $('#sexSelect span:eq(' + index + ')').find('img').attr('src', '../../images/personInfo/sex1-in.png');
        $('#sexSelect span:eq(' + index + ')').css('color', '#333');
        $('#sexSelect span:eq(' + index + ')').siblings().css('color', '#999');
        $('#sexSelect span:eq(' + index + ')').siblings().find('img').attr('src', '../../images/personInfo/sex0.png');
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
    localStorage.setItem("uuid", uuid);
    randomPic();
    var data = JSON.parse(localStorage.getItem("userInfo"));
    $("#username").text(data.name);
    $("#username1").text(data.name);
    if (null == data.photo || "" == data.photo) {

    } else {
        $("#photo1").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo);
        $("#photo2").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo);
    }
    $("#user_name").val(data.name);
    $("#mobiles").text(data.mobile);
    if (data.sex && data.sex == 'M') {
        chSex(0);
    } else {
        chSex(1);
    }
    if (data.birthDate) {
        if (null == data.birthDate || data.birthDate == '') {
            return "1990-10-01";
        }
        var date = new Date(data.birthDate);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        var birth = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
        $("#birthDate").val(birth)
    }
    // 获取班级等信息
    getStudentInfo();
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
        $("#school2").val(user.grade);
        $("#school3").val(user.className);
        $("#school4").val(user.clas_id);

        if (user.mobile == null) {
            $("#school5").val("您还没有绑定手机号");
        } else {
            $("#school5").val(user.mobile);
        }
        $("#school6").val(user.bookVersion);
        if (user.name_num == null) {
            $("#school7").val("您还没有绑定个人账号")
        } else {
            $("#school7").val(user.name_num)
        }
    });
}
// 图片验证码
function randomPic() {
    var uuid = localStorage.getItem("uuid");
    // localhost:8092/picture.do?type=2&randomKey=123
    $("#randomPic").attr("src", getRootPath() + "picture.do?type=2&randomKey=" + uuid + "&t=" + new Date().getTime());
}
function sendMessage() {
    var uuid = localStorage.getItem("uuid");
    var url = "mobileMessage/registMsg.do";
    var param = {};
    param.randomKey = uuid;
    param.randomStr = $("#randomValue").val();
    param.mobile = $("#newMobile").val();
    doAjax("get", url, param, function (data, code) {
        if (code != 0) {
            alert(data.message)
        }
    });
}
function updateMobile() {
    var uuid = localStorage.getItem("uuid");
    var url = "user/updateMobile.do";
    var param = {};
    param.password = $("#password1").val();
    param.mobileRandomKey = uuid;
    param.mobileRandomStr = $("#messageValue").val();
    param.newMobile = $("#newMobile").val();
    doAjax("post", url, param, function (data, code) {
        if (code == '0' || code == 0) {
            alert("操作成功!");
            window.location.reload();
        } else {
            alert(data.message)
        }
    });
}
function updatePassword() {
    var url = "user/updatePassword.do";
    var param = {};
    param.oldPassword = $("#password2").val();
    param.newPassword = $("#password3").val();
    doAjax("post", url, param, function (data, code) {
        if (code == '0' || code == 0) {
            alert("操作成功,重新登录后用户信息生效");
        } else {
            alert(data.message)
        }
    });
}
function subUserInfo() {
    var userName = $.trim($("#user_name").val());
    if (userName == '') {
        alert("请输入姓名");
        return false;
    }

    var url = "user/updatePersionalInfo.do";
    var param = {};
    param.name = $("#user_name").val();
    param.sex = $("#sex").val();
    param.birthDate = $("#birthDate").val();
    doAjax("post", url, param, function (data, code) {
        if (code == '0' || code == 0) {
        	alert("操作成功!");
            reloadUserInfo();
            window.location.reload();
        } else {
            alert(data.message)
        }
    });

}
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
        localStorage.removeItem("userInfo");
        localStorage.setItem("userInfo", JSON.stringify(user));
        window.location.reload();
    });
}
// 更换头像 图片
function uploadImg1() {
    // 获取 input file 元素
    // var file = document.getElementById('picImgFile');
    // run(file, function (imgData) {
    //     var imgBlob = dataURItoBlob(imgData);
    //     var param = {};
    //     param.picfile = imgData;
    //     var url = "user/updatePersionalInfo.do";
    //     doAjax("post", url, param, function (data, code) {
    //         if (code == '0' || code == 0) {
    //             reloadUserInfo();
    //             alert("操作成功!");
    //             window.location.reload();
    //         }
    //     });
    // });
    var param = {};
    param.img = src;
    param.jid = $('#jid').val();
    doAjax("post", url, param, function (data, code) {
        if (code == '0' || code == 0) {
            reloadUserInfo();
            alert("操作成功!");
            //window.location.reload();
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
    if (typeof(FileReader) === 'undefined') {
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

//做个下简易的验证  大小 格式
$('#avatarInput').on('change', function(e) {
    var filemaxsize = 1024 * 5;//5M
    var target = $(e.target);
    var Size = target[0].files[0].size / 1024;
    if(Size > filemaxsize) {
        alert('图片过大，请重新选择!');
        $(".avatar-wrapper").children().remove;
        return false;
    }
    if(!this.files[0].type.match(/image.*/)) {
        alert('请选择正确的图片!')
    } else {
        var filename = document.querySelector("#avatar-name");
        var texts = document.querySelector("#avatarInput").value;
        var teststr = texts; //你这里的路径写错了
        testend = teststr.match(/[^\\]+\.[^\(]+/i); //直接完整文件名的
        filename.innerHTML = testend;
    }

});

function uploadImg() {
    var img_lg = $('#resultImg');
    // 截图小的显示框内的内容
    html2canvas(img_lg, {
        allowTaint: true,
        taintTest: false,
        onrendered: function(canvas) {
            canvas.id = "mycanvas";
            //生成base64图片数据
            var dataUrl = canvas.toDataURL("image/jpeg");
            var newImg = document.createElement("img");
            newImg.src = dataUrl;
            //console.log(dataUrl);
            imagesAjax(dataUrl)
        }
    });
}

function imagesAjax(src) {
    var param = {};
    param.picfile = src;
    console.log(src);
    var url = "user/updatePersionalInfo.do";
    doAjax("post", url, param, function (data, code) {
        if (code == '0' || code == 0) {
            alert("操作成功!");
            reloadUserInfo();
        }
    });
}
$(function () {
    //  自动触发 编辑头像的 移动事件
    $(".avatar-wrapper").hover(function(){
        $(".fa-arrows").click();
    })
})