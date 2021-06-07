const Constants = require('../../shared/constants')
const Item = require('./item')

class Props extends Item{
    constructor(type){
        // 随机位置
        const x = (Math.random() * .5 + .25) * Constants.MAP_SIZE;
        const y = (Math.random() * .5 + .25) * Constants.MAP_SIZE;
        super({
          x, y,
          w: Constants.PROP.RADUIS,
          h: Constants.PROP.RADUIS
        });
    
        this.isOver = false;
        // 什么类型的buff
        this.type = type;
        // 持续10秒
        this.time = 10;
      }
      // 这个道具对玩家的影响
    add(player){
        switch(this.type){
        case 'speed':
            player.speed += 500;
            break;
        }
    }

    // 移除这个道具时将对玩家的影响消除
    remove(player){
        switch(this.type){
        case 'speed':
            player.speed -= 500;
            break;
        }
    }

    // 每帧更新
    update(dt){
        this.time -= dt;
    }

    serializeForUpdate(){
        return {
          ...(super.serializeForUpdate()),
          type: this.type,
          time: this.time
        }
      }
}

module.exports = Props