(function(JCarousel){

    JCarousel.Init = function(box, container, showNum, moveNum) {

        var creatEle = function(tag, attr) {
            if( typeof attr !== "object" ){
                throw "attr should be an object";
            }
            var ele = document.createElement(tag);
            for(name in attr){
                if(attr.hasOwnProperty(name)){
                    ele.setAttribute(name, attr[name]);
                }
            }
            return ele;
        };

        var getAttr = function () {
            var attr = {};
            if(moveNum > showNum){
                throw "The moveNum should not large than the showNum";
            }
            if (box[0] === '.') {
                attr.box = document.getElementsByClassName(box.slice(1))[0];
            }
            else if(box[0] === '#') {
                attr.box = document.getElementById(box.slice(1));
            }
            else {
                throw "The ariguments should be a .classname or #id";
            }
            if (container[0] === '.') {
                attr.container = document.getElementsByClassName(container.slice(1))[0];
            }
            else if(container[0] === '#') {
                attr.container = document.getElementById(container.slice(1));
            }
            else {
                throw "The ariguments should be a .classname or #id";
            }
            return attr;
        };

        //滚动方法的构造函数
        var Scroller = function() {
            var isFnBeingDone = 1;      //标记回调函数的状态,保证动画结束或者中途终止之后执行回调。
            return function (ele, attr, target, fn) {
                clearInterval(ele.timer);
                if(!isFnBeingDone){
                    //console.log('Act stop in half way');
                    //console.log('Run the func');
                    fn && fn();
                }
                isFnBeingDone = 0;
                ele.timer = setInterval(function () {
                    var cur = 0;
                    cur = parseInt(ele.style[attr], 10);
                    var speed = (target - cur) / 8;
                    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); //实现从快到慢的速度转变
                    if (cur === target) {
                        clearInterval(ele.timer);
                        //console.log('run the func');
                        fn && fn();
                        isFnBeingDone = 1;
                    } else {
                        ele.style[attr] = speed + cur + 'px';
                    }
                }, 30);
            };
        };

        var attr = getAttr();
        var act = new Scroller();
        var handler = attr.container,
            box = attr.box,
            items = handler.children,
            itemWidth = items[0].offsetWidth,
            nowIndex = 0,
            prev = creatEle('div',{'class':'prevHandler'}),
            next = creatEle('div',{'class':'nextHandler'});
        moveNum = moveNum ? moveNum : 1;
        showNum = showNum ? showNum : 1;
        handler.style.position = 'relative';
        handler.style.width = '20000px';
        handler.style.left = '0px';
        handler.style.right = '0px';
        box.style.position = 'relative';
        prev.innerHTML = '<';
        next.innerHTML = '>';
        prev.style.display = 'none';
        next.style.display = 'none';
        box.appendChild(prev);
        box.appendChild(next);

        box.onmouseover = function(){
            prev.style.display = 'block';
            next.style.display = 'block';
            //clearInterval(timer);
        };
        box.onmouseout = function(){
            prev.style.display = 'none';
            next.style.display = 'none';
            //timer = setInterval(play, 4000);
        };

        prev.onclick = function() {
            if(nowIndex === 0) {
                for(var i = 0; i < moveNum; i++) {
                    //console.log(handler.children[items.length - 1]);
                    handler.insertBefore(handler.children[items.length - 1], handler.children[0]);
                }
                handler.style.left = -itemWidth * moveNum + 'px';
                act(handler, 'left', 0);
            }else{
                nowIndex -= moveNum;
                act(handler, 'left', -itemWidth * nowIndex);
            }
        };

        next.onclick = function() {
            if(items.length - (nowIndex + moveNum) < showNum) {
                for(var i = 0; i < moveNum; i++) {
                    handler.appendChild(handler.children[0]);
                }
                handler.style.left = -itemWidth * (nowIndex - moveNum) + 'px';
                act(handler, 'left', -itemWidth * (nowIndex));
            }else{
                nowIndex += moveNum;
                act(handler, 'left', -itemWidth * nowIndex);
            }
        };
        //todo 触摸事件
        //todo 代码重构
    };

})(function(){
    return window.JCarousel = {};
}());