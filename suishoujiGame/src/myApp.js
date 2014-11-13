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
    winsize:null,
    sp_catch:null,
    itemArray:null,
    itemSpeed:3.0,//图标下落时间
    schdSpeed:1.0,//生成图标间隔
    gameTime:0,

    init:function ()
    {
        // 1. super init first
        this._super();
        this.winsize = cc.Director.getInstance().getWinSize();
        //背景
        var sp_back=cc.Sprite.create(s_back);
        sp_back.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.5));
        this.addChild(sp_back,0);
        //开始按钮
        var kaishiItem = cc.MenuItemImage.create(s_kaishi,s_kaishi,this.startGame,this);
        var menu = cc.Menu.create(kaishiItem);
        menu.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.32));
        menu.setTag(100);
        this.addChild(menu, 1);
        //游戏规则
        var sp_tip1=cc.Sprite.create(s_tips1);
        sp_tip1.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.45));
        sp_tip1.setTag(101);
        this.addChild(sp_tip1,1);
        //聚宝盆图标
        var sp_back01=cc.Sprite.create(s_catch);
        sp_back01.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.6));
        sp_back01.setTag(102);
        this.addChild(sp_back01, 1);
        //随手记图标
        var sp_back02=cc.Sprite.create(s_icon_bg);
        sp_back02.setScale(0.7);
        sp_back02.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.68));
        sp_back02.setTag(103);
        this.addChild(sp_back02, 2);
        //初始化掉落物品数组
        this.itemArray=[];
    },

    startGame:function()
    {
        this.itemSpeed=3.0;//图标下落时间
        this.schdSpeed=1.0;//生成图标间隔
        this.gameTime=0;
        this.removeBeginUIs();
        this.removeGameOverUIs();
        this.addGameUIs();
        this.schedule(this.addDropItems,this.schdSpeed);
        this.schedule(this.update);
    },

    removeBeginUIs:function()
    {
        //移除开始界面UI
        this.removeChildByTag(100,true);
        this.removeChildByTag(101,true);
        this.removeChildByTag(102,true);
        this.removeChildByTag(103,true);
    },

    addGameUIs:function()
    {
        //添加游戏界面元素
        this.sp_catch=cc.Sprite.create(s_catch);
        this.sp_catch.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.1));
        this.sp_catch.setTag(200);
        this.addChild(this.sp_catch,1);
        this.setTouchEnabled(true);
    },

    removeGameUIs:function()
    {
        //移除主界面元素
        this.removeChildByTag(200,true);
        /*
        for(i in this.itemArray)
        {
            var _item = this.itemArray[i];
            //this.removeItem(_item);
            var _id=this.itemArray.indexOf(_item);
            this.itemArray.splice(_id,1);
            this.removeChild(_item,true);
        }
        */
    },

    addGameOverUIs:function()
    {
        //添加游戏结束UI
        var sp_back03=cc.Sprite.create(s_result);
        sp_back03.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.58));
        sp_back03.setTag(300);
        this.addChild(sp_back03, 2);
        //再来一次按钮
        var zailaiItem = cc.MenuItemImage.create(s_zailaiyici,s_zailaiyici,this.startGame,this);
        var menu = cc.Menu.create(zailaiItem);
        menu.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.32));
        menu.setTag(301);
        this.addChild(menu, 2);
        //tips2
        var sp_tip2=cc.Sprite.create(s_tips2);
        sp_tip2.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.85));
        sp_tip2.setTag(302);
        this.addChild(sp_tip2,2);
        //手
        var sp_hand=cc.Sprite.create(s_point);
        sp_hand.setPosition(cc.p(this.winsize.width*0.8,this.winsize.height*0.85));
        sp_hand.setScale(0.7);
        sp_hand.setRotation(30.0);
        sp_hand.setTag(303);
        this.addChild(sp_hand,2);
        var ac0=cc.MoveTo.create(0.4,cc.p(this.winsize.width*0.85,this.winsize.height*0.9));
        var ac1=cc.MoveTo.create(0.4,cc.p(this.winsize.width*0.8,this.winsize.height*0.85));
        var ac2=cc.Sequence.create(ac0,ac1);
        var ac3=cc.RepeatForever.create(ac2);
        sp_hand.runAction(ac3);
        //成绩
    },

    removeGameOverUIs:function()
    {
        //移除游戏结束UI
        this.removeChildByTag(300,true);
        this.removeChildByTag(301,true);
        this.removeChildByTag(302,true);
        this.removeChildByTag(303,true);
    },

    addDropItems:function()
    {
        //掉落图标
        var itemid=this.getRandom(10);
        var rec=null;
        var _tag=0;
        switch(itemid)
        {
            case 0:case 1:rec=cc.RectMake(2,2,128,128);_tag=210;break;
            case 2:case 3:rec=cc.RectMake(132,2,128,128);_tag=210;break;
            case 4:case 5:rec=cc.RectMake(262,2,128,128);_tag=210;break;
            case 6:rec=cc.RectMake(2,132,128,127);_tag=211;break;
            case 7:rec=cc.RectMake(132,132,128,128);_tag=211;break;
            case 8:rec=cc.RectMake(262,132,128,128);_tag=211;break;
            case 9:rec=cc.RectMake(2,262,128,128);_tag=211;break;
        }
        var posid=this.getRandom(4);
        var pos=null;
        switch(posid)
        {
            case 0:pos=cc.p(this.winsize.width*0.15,this.winsize.height*0.92);break;
            case 1:pos=cc.p(this.winsize.width*0.38,this.winsize.height*0.92);break;
            case 2:pos=cc.p(this.winsize.width*0.62,this.winsize.height*0.92);break;
            case 3:pos=cc.p(this.winsize.width*0.85,this.winsize.height*0.92);break;
        }
        var item=cc.Sprite.create(s_icon,rec);
        item.setTag(_tag);
        item.setPosition(pos);
        this.addChild(item,2);
        this.itemArray.push(item);
        //图标向下掉落
        var ac0=cc.MoveTo.create(this.itemSpeed,cc.p(item.getPositionX(),-item.getContentSize().height*0.5));
        var ac1=cc.CallFunc.create(this.removeItem,this);
        var ac2=cc.Sequence.create(ac0,ac1);
        item.runAction(ac2);
    },

    removeItem:function(sprite)
    {
        //移除图标
        this.removeChild(sprite,true);
        var id=this.itemArray.indexOf(sprite);
        if(id>=0)
        {
            this.itemArray.splice(id,1);
        }
    },

    update:function()
    {
        //游戏主要刷新函数
        for(i in this.itemArray)
        {
            var _item=this.itemArray[i];
            var ix=_item.getPositionX();
            var iy=_item.getPositionY();
            var iw=_item.getContentSize().width;
            var ih=_item.getContentSize().height;
            var cx=this.sp_catch.getPositionX();
            var cy=this.sp_catch.getPositionY();
            var cw=this.sp_catch.getContentSize().width;
            var ch=this.sp_catch.getContentSize().height;
            //发生碰撞则移除
            if(iy-cy>ih*0.5&&iy-cy<ih*0.5+ch*0.35&&Math.abs(ix-cx)<cw*0.5)
            {
                if(_item.getTag()==210)
                {
                    this.removeItem(_item);
                }
                else
                {
                    this.removeGameUIs();
                    this.unschedule(this.addDropItems);
                    this.unschedule(this.update);
                    this.addGameOverUIs();
                    return;
                }
            }
        }
        this.gameTime+=1;
        if(this.gameTime==1200)
        {
            this.gameTime=0;
            if(this.schdSpeed>0.3)
            {
                this.schdSpeed-=0.1;
                this.schedule(this.addDropItems, this.schdSpeed);
            }
            if(this.itemSpeed>1.0)
            {
                this.itemSpeed-=0.29;
            }
        }
    },

    getRandom:function(maxsize)
    {
        //生成随机数
        return Math.floor(Math.random() * maxsize) % maxsize;
    },

    onTouchesMoved:function(touches, event)
    {
        var touch = touches[0];
        var location = touch.getLocation();
        if(this.onClickFlag)
        {
            this.sp_catch.setPosition(cc.p(location.x, this.sp_catch.getPositionY()));
            if(this.sp_catch.getPositionX() < this.sp_catch.getContentSize().width * 0.5)
            {
                this.sp_catch.setPosition(cc.p(this.sp_catch.getContentSize().width * 0.5, this.sp_catch.getPositionY()));
            }
            if(this.sp_catch.getPositionX() > this.winsize.width-this.sp_catch.getContentSize().width * 0.5)
            {
                this.sp_catch.setPosition(cc.p(this.winsize.width-this.sp_catch.getContentSize().width * 0.5, this.sp_catch.getPositionY()));
            }
        }
    },

    onTouchesEnded:function(touches, event)
    {
        this.onClickFlag = false;
    },

    onTouchesBegan:function(touches, event)
    {
        var touch = touches[0];
        var location = touch.getLocation();
        if(cc.rectContainsPoint(this.sp_catch.getBoundingBox(),location))
        {
            this.onClickFlag = true;
        }
    }

});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer,0);
        layer.init();
    }
});
