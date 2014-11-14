/**
 * Created by apple on 14-11-14.
 */
var mainLayer = cc.Layer.extend({
    winsize:null,
    sp_catch:null,
    itemArray:null,
    itemSpeed:3.0,//图标下落时间
    schdSpeed:1.0,//生成图标间隔
    gameTime:0,
    gameOver:false,
    score:0,

    init:function ()
    {
        // 1. super init first
        this._super();
        this.winsize = cc.Director.getInstance().getWinSize();
        //背景
        var sp_back=cc.Sprite.create(s_back);
        sp_back.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.5));
        this.addChild(sp_back,0);
        //初始化掉落物品数组
        this.itemArray=[];
        //添加聚宝盆
        this.sp_catch=cc.Sprite.create(s_catch);
        this.sp_catch.setPosition(cc.p(this.winsize.width*0.5,this.winsize.height*0.1));
        this.sp_catch.setTag(200);
        this.addChild(this.sp_catch,1);
    },

    onEnterTransitionDidFinish:function()
    {
        //开启触摸
        this.setTouchEnabled(true);
        //开启schedule
        this.schedule(this.addDropItems,this.schdSpeed);
        this.scheduleUpdate();
    },

    gotoOverLayer:function()
    {
        var scene=overLayer.create(this.score);
        cc.Director.getInstance().replaceScene(scene);
    },

    addDropItems:function()
    {
        var itemid = this.getRandom(10);
        var rec = null;
        var _tag = 0;
        switch (itemid) {
            case 0:
            case 1:rec = cc.rect(2, 2, 128, 128);_tag = 210;
                break;
            case 2:
            case 3:rec = cc.rect(132, 2, 128, 128);_tag = 211;
                break;
            case 4:
            case 5:rec = cc.rect(262, 2, 128, 128);_tag = 212;
                break;
            case 6:rec = cc.rect(2, 132, 128, 127);_tag = 213;
                break;
            case 7:rec = cc.rect(132, 132, 128, 128);_tag = 214;
                break;
            case 8:rec = cc.rect(262, 132, 128, 128);_tag = 215;
                break;
            case 9:rec = cc.rect(2, 262, 128, 128);_tag = 216;
                break;
        }
        var posid = this.getRandom(4);
        var pos = null;
        switch (posid) {
            case 0:pos = cc.p(this.winsize.width * 0.15, this.winsize.height * 0.92);break;
            case 1:pos = cc.p(this.winsize.width * 0.38, this.winsize.height * 0.92);break;
            case 2:pos = cc.p(this.winsize.width * 0.62, this.winsize.height * 0.92);break;
            case 3:pos = cc.p(this.winsize.width * 0.85, this.winsize.height * 0.92);break;
        }
        var item = cc.Sprite.create(s_icon, rec);
        item.setTag(_tag);
        item.setPosition(pos);
        this.itemArray.push(item);
        this.addChild(item, 2);
        //图标向下掉落
        var ac0 = cc.MoveTo.create(this.itemSpeed, cc.p(item.getPositionX(), -item.getContentSize().height * 0.5));
        var ac1 = cc.CallFunc.create(this.removeItem, this);
        var ac2 = cc.Sequence.create(ac0, ac1);
        item.runAction(ac2);
    },

    removeItem:function(sprite)
    {
        //移除图标
        this.removeChild(sprite,true);
        var id=this.itemArray.indexOf(sprite);
        if(id>-1)
        {
            this.itemArray.splice(id,1);
        }
    },

    update:function(dt)
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
                if(_item.getTag()==210||_item.getTag()==211||_item.getTag()==212)
                {
                    this.removeItem(_item);
                    this.score+=1;
                }
                else
                {
                    cc.log("game over");
                    this.gameOver=true;
                    this.unschedule(this.addDropItems);
                    this.unscheduleUpdate();
                    break;
                }
            }
        }

        if(this.gameOver)
        {
            this.gotoOverLayer();
            return;
        }

        this.gameTime+=1;
        if(this.gameTime==500)
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
})

//构造函数create
mainLayer.create=function()
{
    var _mainLayer=new mainLayer();
    _mainLayer.init();
    var _scene=cc.Scene.create();
    _scene.addChild(_mainLayer);
    return _scene;
}


