function getToken() {
    return localStorage.getItem('X-AUTH-TOKEN')
}
function isEmpty(value) {
    if (typeof value == 'undefined') {
        return true
    } else {
        if (null == value) {
            return true
        }
        if (typeof value == 'String' || typeof value == 'string') {
            if (value == '' || value.trim() == '') {
                return true
            }
        }
        return false
    }
}
function isNull(obj) {
    if (obj) {
    } else {
        obj = ''
    }
    return obj
}
function doAjax(type, url, param, successfn) {
    if (type == '' || type == 'get' || type == 'GET') {
        type = 'GET'
    } else if (type == 'post' || type == 'POST') {
        type = 'POST'
    }
    if (!param || null == param) {
        param = ''
    }
    $.ajax({
        url: getRootPath() + url,
        type: type,
        async: true,
        data: param,
        timeout: 30000,
        dataType: 'json',
        headers: {
            'X-AUTH-TOKEN': getToken()
        },
        beforeSend: function (xhr) {
            showLoading(true)
        },
        success: function (data, textStatus, jqXHR) {
            if (data && data != null) {
                if (data.code == 0 || data.code == '0') {
                    console.log(data.result);
                    successfn(data.result, data.code);
                    showLoading(false)
                } else {
                    if (data.code == '99998') {
                        alert(data.message);
                        localStorage.removeItem('userInfo');
                        localStorage.removeItem('X-AUTH-TOKEN');
                        window.location.href = getLoginPath()
                    } else {
                        successfn(data.result, data.code);
                        //alert(data.message)
                        showLoading(false)
                    }
                }
            } else {
                alert('请求出现问题')
            }
        },
        error: function (xhr, textStatus) {
            //alert("出现错误!" + textStatus)
        },
        complete: function () {
        }
    })
}
function ajaxAsync(type, url, param, successfn) {
    if (type == '' || type == 'get' || type == 'GET') {
        type = 'GET'
    } else if (type == 'post' || type == 'POST') {
        type = 'POST'
    }
    if (!param || null == param) {
        param = ''
    }
    $.ajax({
        url: getRootPath() + url,
        type: type,
        async: true,
        data: param,
        timeout: 30000,
        dataType: 'json',
        headers: {
            'X-AUTH-TOKEN': getToken()
        },
        beforeSend: function (xhr) {
        },
        success: function (data, textStatus, jqXHR) {
            if (data && data != null) {
                if (data.code == 0 || data.code == '0') {
                    console.log(data.result);
                    successfn(data.result, data.code)
                } else {
                    if (data.code == '99998') {
                        alert(data.message);
                        localStorage.removeItem('userInfo');
                        localStorage.removeItem('X-AUTH-TOKEN');
                        window.location.href = getLoginPath()
                    } else {
                        successfn(data.result, data.code);
                        //alert(data.message)
                    }
                }
            } else {
                alert('请求出现问题')
            }
        },
        error: function (xhr, textStatus) {
            //alert("出现错误!" + textStatus)
        },
        complete: function () {
        }
    })
}
function getParam(key) {
    var url = window.document.location.href;
    var pos = url.indexOf('?');
    url = url.substring(pos + 1, url.length);
    var paras = url.split('&');
    for (var i = 0; i < paras.length; i++) {
        var t_values = paras[i].split('=');
        if (t_values[0] == key) {
            return t_values[1]
        }
    }
    return ''
}
function getLoginPath() {
    return window.location.protocol + '//' + window.location.host + '/login';
    //return "http://localhost:8092/";
}
function getRootPath() {
    //return window.location.protocol + '//' + window.location.host + '/oep-be/';
    //return "http://localhost:8092/";
    //return "https://www.aienglish.vip/oep-be/";
    return "https://39.104.76.67/oep-be/";
}
function getWebSocketRootPath() {
    //	return "localhost:8092/";
    return window.location.host + '/oep-be/';
}
function showLoading(show) {
    if (show) {
        $('#over').css('display', 'block');
        $('.loading-text').text('页面加载中,请等待...');
    } else {
        $('#over').css('display', 'none');
    }
}
