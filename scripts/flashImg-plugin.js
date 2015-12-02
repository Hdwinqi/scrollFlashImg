/* Create By qi.huang
 * in 2015-11-29 17:31
 * settings{
 * 	speed:[3000]|[normal] /ms   //滚动速度；
 *  timer: [3000] /ms           //滚动时间间隔；
 *  direction: [left..]        //滚动方向；
 *  isItemNum:[Boolean]        //是否显示下标数
 *  isArrow:  [Boolean]        //是否显示方向箭头
 *  autoPlay:[Boolean];        //是否自动播放默认为true
 *  isArrowAuto:[Boolean];     //初始化的时候是否需要显示方向箭头
 *  stepNum:[number];          //滚地步长倍数(必须是大于0的正整数)默认为1
 * }
 */


(function($,w){

    $.fn.scrollImg = function(settings) {
        var defaults ={
            speed : "normal",
            timer : 2000,
            autoPlay : true,
            isItemNum : true,
            isArrow : true,
            direction : "left",
            isArrowAuto: false,
            stepNum : 1
        };
        settings = $.extend(defaults,settings);
        //console.log(this);
        return this.each(function() {
            scrollCore($(this),settings);
        });

    };

    var scrollCore = $.fn.scrollImg.scrollCore;    //init主函数
    var intervalTime;                             //循环滚动变量
    scrollCore = function(obj,opts){
        //debugger;
        var index=0;
        var showBox = $(".js_img-box",obj);
        var getLi = $(".js_img-box li",obj);
        var size = opts.stepNum ? Math.ceil(getLi.size()/Math.floor(opts.stepNum)) : getLi.size();               //页数
        var getLiStep = '';                                                                                     //步长；
        var getLiAllWidth;                                                                                     //图片总宽度；
        var dirArrow = $('#direction-arrow');
        var arrow = dirArrow.length > 0  ?  dirArrow : obj.parent(),                                           //方向按钮容器
            arrowIcon = arrow.find('i.js_icon-btn');                                                           //方向按钮
        //debugger;
        if(opts.direction=="left" || opts.direction=="right") {
            //debugger;
            getLiStep = opts.stepNum ? Math.floor(opts.stepNum)*getLi.outerWidth(true) : getLi.outerWidth(true);
            getLiAllWidth = getLiStep * size;
            showBox.css("width",getLiAllWidth+"px");
            getLi.css("float","left");
        } else {
            getLiStep = opts.stepNum ? Math.floor(opts.stepNum)*getLi.outerHeight(true) : getLi.outerHeight(true);
            getLiAllWidth = getLiStep * size;
            showBox.css("width","auto");
            showBox.css("height",getLiAllWidth+"px");
            getLi.css("float","none");
        }

        if(opts.isItemNum === true) {
            //下标数签
            $("<ul></ul>",{
                "class":"flash_item",
                html:function() {
                    var setItemInnerHTML="";
                    if(size==1){
                        return;
                    }else if(size>1) {
                        for(var i=1; i<=size; i++){
                            i == 1 ? setItemInnerHTML += "<li class='on'>"+1+"</li>" : setItemInnerHTML += "<li >"+i+"</li>";
                        }

                    }

                    return setItemInnerHTML;
                }

            }).appendTo(obj);
            var itemNum =$(".flash_item li",obj);     //下标
            //光标停于数签时；
            itemNum.hover(function(e){
                var that=this;
                if (intervalTime) {
                    clearInterval(intervalTime);
                }
                intervalTime = setTimeout(function() {
                    index = itemNum.index(that);
                    AdvertiseArea(index);
                    arrowIconShow(index);
                }, 200);
            },function(){
                clearInterval(intervalTime);
                if(opts.autoPlay === true) {
                    interval();
                }
                //arrowIconShow(false);
            });

        }

        //光标停于图片上时
        obj.hover(function(e){
            if(intervalTime){
                clearInterval(intervalTime);
            }
            //console.log(index);
            arrowIconShow(index);
            e.stopPropagation();
        },function(e){
            clearInterval(intervalTime);
            if(opts.autoPlay === true) {
                interval();
            }
            if(!opts.isArrowAuto) {
                arrowIconShow(false);
            }
            e.stopPropagation();
        });

        //点击上一频、下一频
        if(opts.isArrow === true) {

            arrow.off('click.ico').on('click.ico','i.js_icon-btn', function(e){
               //alert('afffffffffff');
                debugger;
                //
                var that = $(this);

                if ( that.is('.icon-chevron-left') ) {          //左
                    index--;
                    if( index < 0 ) {
                        index = size-1;
                    }
                } else if ( that.is('.icon-chevron-right')) {   //右
                    index++;
                    if( index == size ) {
                        index = 0;
                    }
                }
                //console.log(index);
                AdvertiseArea(index);
                arrowIconShow(index);
                e.stopPropagation();
            });
        }

        //设置持续滚动时间间隔函数；
        function interval(){
            intervalTime = setInterval(function(){
                index++;
                if(index == size ){
                    index=0;
                }
                AdvertiseArea(index);
            },opts.timer);
        }
        if(opts.autoPlay === true) {
            interval();
        }

        var AdvertiseArea = function(i){
            var direction = opts.direction;
            switch(direction){
                case "left":
                    showBox.animate({'left' : -i * getLiStep}, opts.speed);
                    break;
                case "right":
                    showBox.animate({'right' : -i* getLiStep}, opts.speed);
                    break;
                case "top":
                    showBox.animate({'top' : -i* getLiStep}, opts.speed);
                    break;
                case "bottom":
                    showBox.animate({'bottom' : -i* getLiStep}, opts.speed);
                    break;
            }
            if(opts.isItemNum === true)
                itemNum.eq(i).addClass("on").siblings().removeClass("on");

        };

        var arrowIconShow = function (stopIndex) {
            //debugger;
            //console.log(stopIndex);
            if( stopIndex===false || opts.isArrow !== true){
                arrowIcon.eq(0).hide();
                arrowIcon.eq(1).hide();
                return;
            }
            if(stopIndex == 0){
                arrowIcon.eq(0).hide();
                arrowIcon.eq(1).show();
            }else if( stopIndex == size-1){
                //debugger;
                arrowIcon.eq(0).show();
                arrowIcon.eq(1).hide();
            }else if(stopIndex >0 && stopIndex < size-1){
                //debugger;
                arrowIcon.eq(0).show();
                arrowIcon.eq(1).show();
            }
        };
        if(opts.isArrowAuto === true) {
            arrowIconShow(index);
        }
    };
})(jQuery,window);