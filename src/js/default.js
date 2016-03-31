/* 
* @Author: darkless
* @Date:   2016-03-30 17:52:09
* @Last Modified by:   darkless
* @Last Modified time: 2016-04-01 00:28:14
*/



$(document).on('pageinit', '#index', function(){
    bindEvent.retrieval(); 
})

//参数
var prefs = {
    isAjax: false,
    local: window.localStorage,
    session: window.sessionStorage,
    recipelist: $('#book'),
    recipeinfo: $('#info')
};

//处理函数
var process = (function(){
    var obj = {};

    $.fn.extend({
        getVal: function(){
            return this.val();
        }
    })

    obj.getRecipeList = function(){
        var keyword = $('#recipe').getVal();
        $.getJSON('http://api.huceo.com/txapi/caipu/?key=721d38ca8ac658cd2cac2ae4b0131977&num=10', {'word':keyword}, function(data){
            if(data.code != '200'){
                prefs.recipelist.html(data.msg);
                return;
            }
            prefs.recipelist.empty();
            var datalist = data.newslist;
            $.each(datalist, function(index, value){
                var oLi = $('<li>').appendTo(prefs.recipelist);
                var oA = $('<a>').prop('href', '#detail').attr({'data-no': datalist[index]['id'],
                    'data-transition': 'slide'}).appendTo(oLi);
                $('<h2>').html(datalist[index]['cp_name']).appendTo(oA);
                $('<p>').html(datalist[index]['texing']).appendTo(oA);
                $('<p>').html(datalist[index]['type_name']).addClass('ui-li-aside').appendTo(oA);

                process.save2Storage.call(value['id'],value);
            })
            prefs.recipelist.listview("refresh");
            $('#book>li a').on('tap', function(){
                process.getRecipeDetail.call(this);
            });
        })
    }
    obj.save2Storage = function(src){
        var arr = [];
        $.each(src, function(index, value){
            arr.push(index+':'+value);
        })

        prefs.session.setItem(this, arr.join('@'));
    }

    obj.getRecipeDetail = function(){
        var id = $(this).attr('data-no');
        var json = {};
        var res = prefs.session[id];
        var data = res.split('@');
        $.each(data, function(index, value){
            var tmp = value.split(':');
            json[tmp[0]] = tmp[1];
        })
        prefs.recipeinfo.empty();
        $('#infoTitle').html(json['cp_name']);
        $('<li>').html('<h2>食材用料:</h2>'+process.subsection(json['yuanliao'])).appendTo(prefs.recipeinfo);
        $('<li>').html('<h2>食材调味:</h2>'+process.subsection(json['tiaoliao'])).appendTo(prefs.recipeinfo);
        $('<li>').html('<h2>食谱做法:</h2>'+process.subsection(json['zuofa'])).appendTo(prefs.recipeinfo);
        $('<li>').html('<h2>小贴士:</h2><p>'+json['tishi']+'</p>').appendTo(prefs.recipeinfo);
        $('<li>').html('<h2>菜肴特色:</h2><p>'+json['texing']+'</p>').appendTo(prefs.recipeinfo);

        // $.mobile.changePage('#detail');
    }

    obj.subsection = function(src){
        var _arr = [];
        var tmp = src.split('；');
        $.each(tmp, function(index, value){
            _arr.push('<p>'+value+'</p>');
        })
        return _arr.join('');
    }

    return obj;
}());

var bindEvent = (function(){
    var obj = {};
    obj.retrieval = function(){
        $('#searchBtn').on('tap', function(e){
            process.getRecipeList();
        });
    }


    return obj;
})();