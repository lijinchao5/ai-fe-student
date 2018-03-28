$(function() {
			// 开始获取用户信息
			var tokenId = getParam("tokenId");
			if (tokenId && null != tokenId && "" != tokenId) {
				localStorage.setItem("X-AUTH-TOKEN", tokenId);
				console.log("手动设置tokenId:"+tokenId);
			}
			var url = "user/getUserInfo.do";
			doAjax("get", url, null, function(user) {
						if (null == user.name || "" == user.name) {
							if (null == user.mobile || "" == user.mobile) {
								user.name = user.userName
							}else{
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

// 写一点儿websocket代码

function initWebSocket(userId) {
	var socket;
	if (typeof(WebSocket) == "undefined") {
		console.log("您的浏览器不支持WebSocket");
	} else {
		if (window.location.protocol == 'http:') {  
            url = 'ws://' + getWebSocketRootPath() + "studentWebSocket.do?id="+userId;  
        } else {  
            url = 'wss://' + getWebSocketRootPath() + "studentWebSocket.do?id="+userId;  
        } 
		socket = new WebSocket(url);
		//socket = new SockJS("http://192.168.10.107:8080/mspjapi/webSocketServer/sockjs");
		
		// 打开事件
		socket.onopen = function() {
			console.log("Socket 已打开");
		};
		// 获得消息事件
		socket.onmessage = function(msg) {
			alert(msg.data);
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
//nav 添加类名
$(".add-top li").click(function(){
	sessionStorage.element=$(this).index()+1;
});