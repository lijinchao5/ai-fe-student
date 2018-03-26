// 答案解析  显示/隐藏 控制
var flag = false;
$(".key-check").click(function(){
    if(flag==false){
        flag = true;
        $(this).next(".exam-key-content").css("display", "block");
    }else{
        flag = false;
        $(this).next(".exam-key-content").css("display", "none");
    }
});