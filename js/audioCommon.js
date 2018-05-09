//读取单词
function readrecord(id,fun,speed){
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
			$("body").prepend($("<div style='display:none' id='readdiv'> <audio id='player_audio' src='' preload='auto'/></div>"))
		}
		$("#player_audio").attr("src",function(){
			var client = new OSS.Wrapper({
                region : 'oss-cn-beijing',
                accessKeyId : 'LTAINbwOMw6UaaK3',
                accessKeySecret : 'CxOkyQD24n8d0kOzg3MYcQlopBUeDY',
                bucket : 'xl-oss-pro1'
            });
			return client.signatureUrl(id);
		});
		try {
			document.getElementById("player_audio").volume=voice/100;
		} catch (e) {
			//console.log("读取声音大小错误！");
		}

        document.getElementById("player_audio").volume=1;
        if(speed){
            document.getElementById("player_audio").playbackRate = parseFloat(speed);
        }
        console.log(document.getElementById("player_audio").playbackRate);

		document.getElementById("player_audio").play();
		var recordtime= new Date().getTime();
		console.log("时间"+recordtime);
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