$(function(){
	var new_element = document.createElement("script");
	new_element.setAttribute("type", "text/javascript");
	new_element.setAttribute("src", "https://gosspublic.alicdn.com/aliyun-oss-sdk-4.3.0.min.js");
	document.body.appendChild(new_element);
})

//读取单词
function readrecord(id,fun){
	console.log(id);
	try {
		if(id==null||id=="null"){
			if(fun!=undefined){
				setTimeout(function(){
					fun(0);
				},0)
			}
			return;
		}
		if($("#player_audio").length == 0){
			$("body").prepend($("<div style='display: none;' id='readdiv'> <audio id='player_audio' src='' preload='auto'/></div>"))
		}
		$("#player_audio").attr("src",function(){
			//var iPDdZJ1 = new OSS["\x57\x72\x61\x70\x70\x65\x72"]({		region : '\x6f\x73\x73\x2d\x63\x6e\x2d\x68\x75\x68\x65\x68\x61\x6f\x74\x65',		accessKeyId : '\x4c\x54\x41\x49\x4a\x54\x34\x71\x58\x67\x56\x47\x63\x30\x48\x4b',		accessKeySecret : '\x4c\x6e\x72\x61\x66\x79\x45\x6d\x76\x38\x50\x38\x62\x65\x69\x6e\x78\x41\x38\x74\x76\x33\x35\x61\x61\x6a\x36\x35\x61\x66',		bucket : '\x78\x6c\x2d\x61\x75\x64\x69\x6f\x2d\x66\x69\x6c\x65\x2d\x73\x74\x6f\x72\x65'	});	return iPDdZJ1["\x73\x69\x67\x6e\x61\x74\x75\x72\x65\x55\x72\x6c"](id);
			var client = new OSS.Wrapper({
				region : 'oss-cn-huhehaote',
				accessKeyId : 'LTAIJT4qXgVGc0HK',
				accessKeySecret : 'LnrafyEmv8P8beinxA8tv35aaj65af',
				bucket : 'xl-audio-file-store'
			});
			return client.signatureUrl(id);
		});
		try {
			document.getElementById("player_audio").volume=voice/100;
		} catch (e) {
			//console.log("读取声音大小错误！");
		}
		document.getElementById("player_audio").play();
		var recordtime= new Date().getTime();
		document.getElementById("player_audio").addEventListener('ended', function() {
			$("#readdiv").remove();
			if(fun!=undefined)fun(new Date().getTime()-recordtime);
		}, true);
	} catch (e) {
		//console.log("读取错误！"+e);
	}
}

/*模板数据绑定*/
function formatTemplate(data, tmpl) {
	var format = {
		name : function(x) { return x; }
	};
	return tmpl.replace(/{(\w+)}/g, function(m1, m2) {
		if (!m2) return "";
		var _val = (format && format[m2]) ? format[m2](data[m2]) : data[m2];
		return (_val!=undefined && _val!= null) ? _val : "";
	});
}


var  ConfigLY={
	//wordSpeaking.js
	 //录音前读取id
	 startrecordid:"tip_8797c58a-2a33-469d-84ca-34159bde5f66.mp3",//library.js
	 //准备答题id
	 PrepareAnswerid:"tip_e79aa3a6-3d35-4bce-b4d9-622872b04fcd.mp3",
	 //请先听一遍
	 PleaseListenid:"tip_fdfc77f12df04e08a46e404cb02a89ee.mp3",
	 
	 
	 //simulationExamCommon.js
	//开始阅题
	 ytstart:"tip_1e1f196b-d061-4b99-a334-692d030ea3a3.mp3",
	 //结束阅题
	 ytend:"tip_70ff9233-d95c-4a65-ad1a-1cfae3d721b5.mp3",
	 //开始答题
	 dtstart:"tip_0ee2095e-e482-4cb0-b142-76fc9262ee58.mp3",
	 //结束答题
	 dtend:"tip_e64e6192-b43f-4462-ab24-c93b6279b1a7.mp3",
	
	 bigdatareadArr : new Array(
				'',
				//听后回答
				'tip_f59ac9f8-7d99-4b78-97c4-225a84d3cfec.mp3',
				//听后选择
				'tip_d0dc8b64-ef40-415e-be52-eb57dac043d7.mp3',
				//听后记录及转述
				'tip_c74bfb20-989b-408b-bc9d-05e04a53bdda.mp3',
				//短文朗读
				'tip_1de5dd91-cd09-4b25-b641-15f2649dc4a1.mp3',
				//情景问答
				'tip_d19f377e-f7bf-4f31-98cf-9c4a81d03722.mp3',
				//话题简述
				'tip_4e305272-dfd8-4195-b0f1-03b39d7a163d.mp3'
	)
}