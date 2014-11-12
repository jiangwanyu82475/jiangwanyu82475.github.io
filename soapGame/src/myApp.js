/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            s_CloseNormal,
            s_CloseSelected,
            function () {
                cc.log("close");
            },this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Impact", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create(s_HelloWorld);
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        this.sprite.setScale(size.height/this.sprite.getContentSize().height);
        this.addChild(this.sprite, 0);
    }
});

var newLayer=cc.LayerColor.extend(
    {
        winSize:null,
        box:null,
        soap:null,
        soapArr:null,
        beginP:null,
        endP:null,

        init:function()
        {
            this._super();
            this.winSize=cc.Director.getInstance().getWinSize();
            this.setColor(cc.c4(255,255,255,125));

            //添加肥皂、箱子
            this.soapArr=[];
            this.box=cc.Sprite.create(s_box);
            this.soap=cc.Sprite.create(s_soap);
            this.box.setPosition(cc.p(this.winSize.width*0.1,this.winSize.height*0.8));
            this.soap.setPosition(cc.p(this.winSize.width*0.5,this.winSize.height*0.1));
            //this.box.setScale(0.4);
            this.soap.setScale(0.5);
            this.addChild(this.box,10);
            this.addChild(this.soap,10);
            //箱子左右循环移动
            var ac0=cc.MoveBy.create(1.5,cc.p(this.winSize.width*0.8,0.0));
            var ac1=cc.MoveBy.create(1.5,cc.p(-this.winSize.width*0.8,0.0));
            var ac2=cc.RepeatForever.create(cc.Sequence.create(ac0,ac1));
            this.box.runAction(ac2);

            //启用触摸
            this.setTouchEnabled(true);

            //调用update函数，每帧刷新一次
            this.schedule(this.update);

            return true;
        },

        update:function()
        {
            for(var i=0;i<this.soapArr.length;i++)
            {
                var soaps=this.soapArr[i];
                var soaprec=soaps.getBoundingBox();
                var boxrec=this.box.getBoundingBox();
                if(cc.rectIntersectsRect(soaprec,boxrec))
                {
                    cc.log("collide");
                    soaps.stopAllActions();
                    this.removeChild(soaps);
                    this.soapArr.splice(this.soapArr.indexOf(soaps), 1);
                }
            }
        },

        removeSprite:function(sprite)
        {
            this.removeChild(sprite,true);
            var index = this.soapArr.indexOf(sprite);
            if (index > -1)
            {
                this.soapArr.splice(index, 1);
            }
        },

        onTouchesMoved:function(touches, event)
        {

        },

        onTouchesEnded:function(touches, event)
        {
            this.onClickFlag = false;
            this.endP=touches[0].getLocation();
            if(this.beginP&&(this.endP.y-this.beginP.y)>=this.winSize.height*0.1)
            {
                var ey=this.winSize.height;
                var ex=this.beginP.x-(this.beginP.x-this.endP.x)*(this.winSize.height-this.beginP.y)/(this.endP.y-this.beginP.y);
                cc.log(Math.pow(ex,2));
                //cc.sqrt(cc.pow(ex,2)+cc.pow(ey,2))/this.winSize.height*0.5
                var ac0=cc.MoveTo.create(Math.sqrt(Math.pow(ex,2)+Math.pow(ey,2))/this.winSize.height*0.5,cc.p(ex,ey));
                var ac1=cc.CallFunc.create(this.removeSprite,this);
                var soapActive=cc.Sprite.create(s_soap);
                soapActive.setPosition(cc.p(this.winSize.width*0.5,this.winSize.height*0.1));
                soapActive.setScale(0.5);
                this.addChild(soapActive,1);
                this.soapArr.push(soapActive);
                soapActive.runAction(cc.Sequence.create(ac0,ac1));
            }
        },

        onTouchesBegan:function(touches, event)
        {
            var touch = touches[0];
            var location = touch.getLocation();
            if(cc.rectContainsPoint(this.soap.getBoundingBox(),location))
            {
                this.onClickFlag = true;
                this.beginP=this.soap.getPosition();
            }
            else
            {
                this.beginP=null;
            }
        }
    }
)

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new newLayer();
        layer.init();
        this.addChild(layer,0);
    }
});
