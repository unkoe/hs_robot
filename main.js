auto();

//申请权限
if(!requestScreenCapture(true)){
    toast("请求截图失败");
    exit();
}
sleep(3000);
//判断是否启动起点并启动起点
launchApp("炉石传说");


var control = {
    assets: {},
    init : function() {
        this.assets['mode'] = {    
            "fight":"/sdcard/hs_robot/assets/mode/fight.png", //对战模式
            "adventure":"/sdcard/hs_robot/assets/mode/adventure.png", //冒险模式
            "melee":"/sdcard/hs_robot/assets/mode/melee.png", //乱斗模式
            "other":"/sdcard/hs_robot/assets/mode/other.png", //其他模式
            "leisure":"/sdcard/hs_robot/assets/mode/leisure.jpg", //其他模式
            "leisure_max":"/sdcard/hs_robot/assets/mode/leisure_max.png", //其他模式
        }
        this.assets['game'] = {    
            "collect":"/sdcard/hs_robot/assets/game/collect.png", //收藏
            "log":"/sdcard/hs_robot/assets/game/log.png", //日志
            "shop":"/sdcard/hs_robot/assets/game/shop.png", //商店
            "box":"/sdcard/hs_robot/assets/game/box.png", //卡包
            "turn-end":"/sdcard/hs_robot/assets/game/turn-end.png", //卡包
            "over-turn":"/sdcard/hs_robot/assets/game/over-turn.png", //卡包
            "choice_card":"/sdcard/hs_robot/assets/game/choice_card.png", //卡包
        }
    },
    get : function(ass, con) {
        return images.read(this.assets[ass][con]);
    }
  };

// 找到图片
let clickOnControl = function(img) {
    while (true) {
        let full_screen = get_screen(true);
        let match = images.findImage(full_screen, img, {
            threshold: 0.8
        });
        if (match != null){
            click(match.x, match.y);
            break;
        }
        click(40, 80);
        full_screen.recycle();
        sleep(1000);
    }
    
}

let get_screen = function(full_screen) {

    if (full_screen==null){
        log('this first param is null, please enter in a boolean value');
    }
    let screen = "/sdcard/Pictures/screen.png";
    let screen_ = "/sdcard/Pictures/screen_.png";

    shell("screencap -p " + screen, true);
    sleep(100);

    if (full_screen) {
        let full_screen_obj = images.read(screen);
        return full_screen_obj;
    } else {
        images.save(images.clip(full_screen_obj, x, y, width, height), screen_);
        let screen_obj = images.read("/sdcard/Pictures/screen_.png");
        return screen_obj;
    }

}

//选取首页控件
//clickOnControl(control.get('mode', 'fight'));
//选取对战模式
//休闲模式
chooseCasualMode = function() {
    log("进入游戏，选择对战模式")
    while (true) {
        sleep(2000);
        //leisure = [[-13,-23,"#825618"], [-18,27,"#967238"], [24,3,"#9B7735"]];
        let full_screen = get_screen(true);
        //let point = images.findMultiColors(full_screen, '#DAB956', leisure);
        let point = images.findImage(full_screen, control.get('mode', 'leisure'), {
            threshold: 0.8
        });
        if (point){
            log("选择卡组");
            click(1020,350);
            break;
        } else {
            log("不是休闲模式，打开模式选项卡");
            click(1220, 55);
        }
    
        sleep(2000)
        let new_full_screen = get_screen(true);
        sleep(500)
        let condition = images.findImage(new_full_screen, control.get('mode', 'leisure_max'), {
            threshold: 0.8
        });
        if (condition) {
            log("选择休闲模式");
            click(1050, 300);
            sleep(2000)
        }
        full_screen.recycle();
        new_full_screen.recycle();
    }
    sleep(1500);
    click(963, 344)
    sleep(500);
    click(999, 603)
    sleep(500);
    click(999, 603)
}

choiceCard = function() {
    let full_screen = get_screen(true)
    let point = images.findImage(full_screen, control.get('game', 'choice_card'), {
        threshold: 0.7,
        region: [350, 25, 430, 95]
    });
    full_screen.recycle();

    if (point) {
        log('卡牌效果，需要选择一张牌，选择中间的牌');
        click(620, 377);
        return;
    }
}

turnEnd = function() {
    let full_screen = get_screen(true);
    let point = images.findColor(full_screen, "#197102", {
        region: [1075, 310, 175, 90],
        threshold: 4
    });

    if (point) {
        log("发现可以结束，结束回合");
        click(1160, 357);
    }
    full_screen.recycle();
    sleep(500);
}

overTurn = function() {
    let full_screen = get_screen(true);
    let point = images.findImage(full_screen, control.get("game", "over-turn"), {
        threshold: 0.8
    });

    if (point) {
        log("发现可以结束，结束回合");
        click(1160, 357);
    }
    full_screen.recycle();
    sleep(500);
}


start = function() {

    while (true) {
        let full_screen = get_screen(true);
        let point = images.findColor(full_screen, "#85C8FF", {
            region: [550, 610, 220, 90],
            threshold: 4
        });
        if (point) {
            log("开始本局")
            click(642, 635);
            break;
        }
        full_screen.recycle();
        sleep(500);
    }

}


findAvailableCard = function() {
    for (let index = 0; index < 20; index++) {
        //每次寻找可用的牌前，先判断是否可以直接结束
        turnEnd();
        let full_screen = get_screen(true);
        //绿色可用牌
        let point = images.findColor(full_screen, "#4BFF31", {
            region: [780, 600, 470, 120],
            threshold: 6
        });
        //橙色推荐牌
        let point_ = images.findColor(full_screen, "#FFFF09", {
            region: [780, 600, 470, 120],
            threshold: 6
        });
        if (point || point_) {
            log("发现可用的牌, 打开手牌")
            openHand();
            return true;
        }
        full_screen.recycle();
        sleep(500);
    }
    //20次没找到可用的牌，强制结束
    log("20次没找到可用的牌，强制结束");
    click(1160, 357);
    return false;

}

playCards = function() {
    log("开始出牌")
    let flag = false;
    let array = [[250, 680], [450, 680], [640, 650], [840, 650], [1040, 650], [1235, 680]]
    for (let i = 1; i <= 3; i++) {
        let status = spellAttacks(array);
        if (!status){
            returnBoard();
        }
        log("进行随从攻击");
        let flag_1 = afterAttack();
        if (!flag_1) {
            log("随从攻击完，不再进行尝试");
            flag_1 = true;
        }
        if (!flag){
            log("尝试1次法师技能攻击");
            log("关掉手牌");
            returnBoard();
            log("攻击");
            gesture(1200, [777, 640], [664, 277]);
            log("打开手牌");
            openHand();
            flag=true;
        }
        log("还有可用的牌，进行第" + i + "次尝试");

    }
    log("尝试3次，强制结束");
    returnBoard();
    sleep(300)
    click(1160, 357);
}

foundAfter = function () {
    let full_screen = get_screen(true);
    //绿色可用随从
    let point = images.findColor(full_screen, "#4BFF31", {
        region: [160, 360, 900, 150],
        threshold: 4
    });
    return point;
}

afterAttack = function(target) {
    if (!foundAfter()) {
        log("没有可攻击的随从");
        return false;
    }
    log("发现可攻击随从，逐一攻击");
    const retinue_weight = 150;
    const screen = 1280;
    const screen_ = 1100;
    const frame = (screen - screen_) / 2;
    const origin = frame + retinue_weight / 2;
    let y = 450;
    let x = origin;
    let xy = []
    xy.push([x, y])
    for (let index = 0; index < screen / retinue_weight - 1; index++) {
        x += retinue_weight;
        toastLog("加入随从,x坐标："+ x);
        if (!foundAfter()) {
            log("没有可攻击的随从了");
            return false;
        }
        log("攻击对方英雄");
        gesture(800, [x, y] , [650, 100]);
        sleep(300);
        log("攻击对方随从");
        gesture(800, [x, y] , [664, 277]);
        sleep(300);
    }
    log("还有随从可攻击，跳过");
    return false;
}
//返回桌面
returnBoard = function(){
    click(140, 390);
    sleep(300);
}
openHand = function() {
    click(1000, 675);
    sleep(300);
}
spellAttacks = function(array) {
    for (let index = 0; index < array.length; index++) {
        turnEnd();
        //绿色可用牌
        let full_screen_ = get_screen(true);
        let point = images.findColor(full_screen_, "#4BFF31", {
            region: [50, 550, 1200, 160],
            threshold: 6
        });
        //橙色推荐牌
        let point_ = images.findColor(full_screen_, "#FFFF09", {
            region: [780, 600, 470, 120],
            threshold: 6
        });
        if (!point && !point_) {
            log("没有可用的牌了");
            return false;
        }
        full_screen_.recycle();
        log("攻击对方英雄")
        gesture(800, array[index], [650, 100]);
        choiceCard();
        returnBoard();
        openHand();
        log("攻击对方随从")
        gesture(800, array[index], [664, 277]);
        choiceCard();
        returnBoard();
        openHand();
        sleep(300);
    }
    return true;
}

control.init();
//clickOnControl(control.get('mode', 'fight'));
//chooseCasualMode();
start();


let index = 1;
while (index++>0) {
    while (overTurn()) {
        log("对方回合中, 休息2秒再检测...");
        sleep(2000);
    }
    log("来到我第:"+ index +"回合");

    let status = findAvailableCard();
    sleep(888);
    if (status) {
        playCards();
        sleep(1000);
        turnEnd();
    }
    sleep(1000);
}

sleep(5000);
