$(function() {
	// 获取用户信息
	var data = JSON.parse(localStorage.getItem("userInfo"));
	$("#username").text(data.name);
	if (data.name == "" || data.name == null) {
		$("#username").text("尚未设置昵称");
	}
	if (null == data.photo || "" == data.photo) {
		$("#photo").attr("src", "../../images/common/l-meb-icon.png")
	} else {
		$("#photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
	}
	initWebSocket(data.id);
	// 百度统计
	var _hmt = _hmt || [];

	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?97575344e8fa059fb7b15ccda6cfcab9";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
	$('#dialogButton').modal({
		backdrop : 'static',
		keyboard : false,
		show : false
	});
});

function dialogClose() {
	$("#dialogButton").attr("data-toggle1", "1");
}

function initWebSocket(userId) {
	var socket;
	if (typeof (WebSocket) == "undefined") {
		console.log("您的浏览器不支持WebSocket");
	} else {
		if (window.location.protocol == 'http:') {
			url = 'ws://' + getWebSocketRootPath() + "studentWebSocket.do?id=" + userId;
		} else {
			url = 'wss://' + getWebSocketRootPath() + "studentWebSocket.do?id=" + userId;
		}
		socket = new WebSocket(url);
		// socket = new
		// SockJS("http://192.168.10.107:8080/mspjapi/webSocketServer/sockjs");

		// 打开事件
		socket.onopen = function() {
			console.log("Socket 已打开");
		};
		// 获得消息事件
		socket.onmessage = function(msg) {
			var ats = $("#dialogButton").attr("data-toggle1");
			if (ats == "1") {
				$("#dialog_content").text(msg.data + ",老师催收了！");
				$("#dialogButton").attr("data-toggle1", "0");
				$("#dialogButton").click();
			} else {
				// var text = $("#dialog_content").text();
				$("#dialog_content").append("<p>" + msg.data + ",老师催收了！</p>");
				// $("#dialog_content").text(text + msg.data);
			}
		};
		// 关闭事件
		socket.onclose = function() {
			console.log("Socket已关闭");
		};
		socket.onerror = function() {
			console.log("Socket发生了错误");
		}
	}

}

function logout() {
	localStorage.removeItem("userInfo");
	localStorage.removeItem("X-AUTH-TOKEN");
	window.location.href = getLoginPath();
}