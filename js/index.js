$(function () {
    //百度统计
    var _hmt = _hmt || [];

    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?97575344e8fa059fb7b15ccda6cfcab9";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);

    // webp 格式判断
    // See http://www.guanggua.com/question/5573096-detecting-webp-support.html
    function canUseWebP() {
        var elem = document.createElement('canvas')
        if (!!(elem.getContext && elem.getContext('2d'))) {
            // was able or not to get WebP representation
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
        }
        // very old browser like IE 8, canvas not supported
        return false
    }
    $('.blod-image').addClass(canUseWebP() ? 'webp' : 'no-webp');
    $('.bottom-bg li.first').addClass(canUseWebP() ? 'webp' : 'no-webp');
    $('.bottom-bg li.second').addClass(canUseWebP() ? 'webp' : 'no-webp');
    $('.bottom-bg li.third').addClass(canUseWebP() ? 'webp' : 'no-webp');
    $('.bottom-bg li.last').addClass(canUseWebP() ? 'webp' : 'no-webp');

    // 开始获取用户信息
    var tokenId = getParam("tokenId");
    if (tokenId && null != tokenId && "" != tokenId) {
        localStorage.setItem("X-AUTH-TOKEN", tokenId);
        console.log("手动设置tokenId:" + tokenId);
    }
    var url = "user/getUserInfo.do";
    doAjax("get", url, null, function (user) {
        if (null == user.name || "" == user.name) {
            if (null == user.mobile || "" == user.mobile) {
                user.name = user.userName
            } else {
                user.name = user.mobile
            }
        }
        localStorage.setItem("userInfo", JSON.stringify(user));
        $("#indexusername").text(user.name);
        if (null == user.photo || "" == user.photo) {

        } else {
            $("#indexphoto").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + user.photo)
        }
        initWebSocket(user.id);
    });
});
function dialogClose(){
	$("#dialogButton").attr("data-toggle1","1");
}
// 写一点儿websocket代码

function initWebSocket(userId) {
    var socket;
    if (typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    } else {
        if (window.location.protocol == 'http:') {
            url = 'ws://' + getWebSocketRootPath() + "studentWebSocket.do?id=" + userId;
        } else {
            url = 'wss://' + getWebSocketRootPath() + "studentWebSocket.do?id=" + userId;
        }
        socket = new WebSocket(url);
        //socket = new SockJS("http://192.168.10.107:8080/mspjapi/webSocketServer/sockjs");

        // 打开事件
        socket.onopen = function () {
            console.log("Socket 已打开");
        };
        // 获得消息事件
        socket.onmessage = function (msg) {
        	var ats = $("#dialogButton").attr("data-toggle1")
        	if(ats == "1"){
        		$("#dialog_content").text(msg.data);
        		$("#dialogButton").attr("data-toggle1","0");
        		$("#dialogButton").click()
        	}else{
        		var text=$("#dialog_content").text();
        		$("#dialog_content").text(text+msg.data);
        	}
            
        };
        // 关闭事件
        socket.onclose = function () {
            console.log("Socket已关闭");
        };
        socket.onerror = function () {
            console.log("Socket发生了错误");
        }
    }

}
//nav 添加类名
$(".add-top li").click(function () {
    sessionStorage.element = $(this).index() + 1;
});