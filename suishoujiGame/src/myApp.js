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

var beginLayer = cc.Layer.extend({
    winsize:null,

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
        sp_tip1.setScale(1.2);
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
        return true;
    },

    startGame:function()
    {
        var scene=mainLayer.create();
        cc.Director.getInstance().replaceScene(scene);
    }

});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new beginLayer();
        this.addChild(layer,0);
        layer.init();
    }
});
