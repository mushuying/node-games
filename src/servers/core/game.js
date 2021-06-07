const Player = require('../objects/player')
const Constants = require('../../shared/constants')
const Prop = require("../objects/prop");

class Game{
    constructor(){
        this.sockets={}
        this.players={} //玩家游戏对象信息
        this.bullets=[]
        this.props = [];
        this.lastUpdateTime=Date.now();
        this.shouldSendUpdate = false
        this.createPropTime = 0;
        setInterval(this.update.bind(this),1000/60)
    }
    update(){
        const now = Date.now()
        const dt = (now-this.lastUpdateTime)/1000
        this.lastUpdateTime = now

        // 这个定时为0时添加
        this.createPropTime -= dt;
        // 过滤掉已经碰撞后的道具
        this.props = this.props.filter(item => !item.isOver)
        // 道具大于10个时不添加
        if(this.createPropTime <= 0 && this.props.length < 10){
        this.createPropTime = Constants.PROP.CREATE_TIME;
        this.props.push(new Prop('speed'))
        }

        Object.keys(this.sockets).map(playerID => {
            const socket = this.sockets[playerID]
            const player = this.players[playerID]
            // 如果玩家的血量低于等于0就告诉他游戏结束，并将其移除游戏
            if(player.hp <= 0){
              socket.emit(Constants.MSG_TYPES.GAME_OVER)
              this.disconnect(socket);
            }
          })
 
        // 更新玩家人物
        Object.keys(this.players).map((playerID)=>{
            const player = this.players[playerID]
            player.update(dt)
        })

        if(this.shouldSendUpdate){
            Object.keys(this.sockets).map(playerID=>{
                const socket = this.sockets[playerID]
                const player = this.players[playerID]
                socket.emit(
                    Constants.MSG_TYPES.UPDATE,
                    // 处理游戏中的对象数据发送给前端
                    this.createUpdate(player)
                )
            })
            this.shouldSendUpdate=false
        }else{
            this.shouldSendUpdate=true
        }

        this.collisionsBullet(Object.values(this.players), this.bullets);
        this.collisionsProp(Object.values(this.players), this.props)
    }
    // 玩家与道具的碰撞检测
    collisionsProp(players, props){
       for(let i = 0;i<props.length;i++){
           for(let j = 0;j<players.length;j++){
               let props = props[i]
               let player = players[j]
               if(player.distanceTo(prop)<=Constants.PLAYER.RADUIS+Constants.PROP.RADUIS){
                    // 碰撞后，道具消失
                    prop.isOver = true;
                    // 玩家添加这个道具的效果
                    player.pushBuff(prop);
                    break;
               }
           }
       }
    }
    // 这里是之前的collisions，为了和碰撞道具区分
    collisionsBullet(players,bullets){
         for(let i = 0;i<bullets.length;i++){
             for(let j = 0;j<players.length;j++){
                let bullet = bullets[i];
                let player = players[j];
                 // 自己发射的子弹不能达到自己身上
                 // distanceTo是一个使用勾股定理判断物体与自己的距离，如果距离小于玩家与子弹的半径就是碰撞了
                 if(bullet.parentID !== player.id
                    && player.distanceTo(bullet) <= Constants.PLAYER.RADUIS + Constants.BULLET.RADUIS
                    ){
                          // 子弹毁灭
                        bullet.isOver = true;
                        // 玩家扣血
                        player.takeBulletDamage();
                        // 这里判断给最后一击使其死亡的玩家加分
                        if(player.hp <= 0){
                            this.players[bullet.parentID].score++;
                        }
                        break;
                    }
             }
         }
    }
    handleInput(socket,item){
        const player = this.players[socket.id]
        if(player){
            let data = item.action.split('-');
            let type = data[0];
            let value = data[1];
            switch(type){
               case 'move':
                   player.move[value] = typeof item.data === 'boolean'?'item.data'?1:-1:0
                break;
                // 更新鼠标位置
            case 'dir':
            player.fireMouseDir = item.data;
            break;
          // 开火/停火
          case 'bullet':
            player.fire = item.data;
            break;
            }
        }
    }
    createUpdate(player){
      // 其他玩家
      this.otherPlayer = Object.values(this.players).filter(
          p=>p!==player
      )
      return {
          t:Date.now(),
          p:player.serializeForUpdate(),
          others:this.otherPlayer,
          bullets:this.bullets.map(bullet=>bullet.serializeForUpdate())
      }
    }
    joinGame(socket,username){
        this.sockets[socket.id]=socket

        const x = (Math.random() * .5 + .25) * Constants.MAP_SIZE
        const y = (Math.random() * .5 + .25) * Constants.MAP_SIZE
        this.players[socket.id] = new Player({
            id:socket.id,
            username:this.username,
            x,y,
            w:Constants.PLAYER.WIDTH,
            h:Constants.PLAYER.HEIGHT
        })
    }
    disconnet(socket){
         delete this.sockets[socket.id],
         delete this.players[socket.id]
    } 

}
module.exports = Game