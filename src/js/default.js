/*
* @Author: darkless
* @Date:   2016-03-30 17:52:09
* @Last Modified by:   anchen
* @Last Modified time: 2016-04-05 18:06:40
*/



$(document).on('pageinit', '#index', function(){
    bindEvent.retrieval();
})

$(document).on('pageinit', '#detail', function(){
    $('#infoTitle').on('tap', function(){
        history.back(-1);
    })
})

$(document).on('pageinit', '#fav', function(){
    bindEvent.hot();
})

//参数
var prefs = {
    isAjax: false,
    local: window.localStorage,
    session: window.sessionStorage,
    recipelist: $('#book'),
    recipeinfo: $('#info'),
    favlist: $('favlist')
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
        $(this).button('option','disabled',true);
        $.mobile.loading('show');
        var keyword = $('#recipe').getVal();
        $.getJSON('http://api.huceo.com/txapi/caipu/?key=721d38ca8ac658cd2cac2ae4b0131977&num=10', {'word':keyword}, function(data){
            // console.log(data);
            if(data.code != '200'){
                prefs.recipelist.html(data.msg);
                return;
            }
            prefs.recipelist.empty();
            prefs.session.clear();
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
        $(this).button('option', 'disabled', false);
        $.mobile.loading('hide');

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

//绑定事件函数
var bindEvent = (function(){
    var obj = {};
    obj.retrieval = function(){
        $('#searchBtn').on('tap', function(e){
            process.getRecipeList.call(this);
        });
    }

    obj.hot = function(){
        process.showFav();
    }


    return obj;
})();

var process = (function(obj){
    obj.showFav = function(){
        $.mobile.loading('show');
        $.getJSON('./script/toSQL.php', {'showfav': '1'}, function(data){
            prefs.favlist.empty();
            prefs.session.clear();
            var datalist = data;
            $.each(datalist, function(index, value){
                var oLi = $('<li>').appendTo(prefs.favlist);
                var oA = $('<a>').prop('href', '#detail').attr({'data-no': datalist[index]['rid'],'data-transition': 'slide'}).appendTo(oLi);
                $('<h2>').html(datalist[index]['name']).appendTo(oA);
                $('<p>').html(datalist[index]['feature']).appendTo(oA);
                $('<p>').html(datalist[index]['classify']).addClass('ui-li-aside').appendTo(oA);

                process.save2Storage.call(value['rid'],value);
            })

            prefs.favlist.listview("refresh");
            $.mobile.loading('hide');
            $('#favlist>li a').on('tap', function(){
                process.getRecipeDetail.call(this);
            });
        })
    }

    obj.showFavDetail = function(){

    }

    obj.save2SQL = function(){

    }

    return obj;
}(process));