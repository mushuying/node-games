const Item = require('./item')
const Constants = require('../../shared/constants')

class Player extends Item{
   constructor(data){
      super(data)
      this.username = data.username
      this.hp = Constants.PLAYER.MAX_Hp
      this.speed = Constants.PLAYER.SPEED
      this.score = 0
      this.buffs = []
      this.move = {
        left: 0, right: 0,
        top: 0, bottom: 0
      };
      // 开火
    this.fire = false;
    this.fireMouseDir = 0;
    this.fireTime = 0;
   }
   update(dt){
    // 这里的dt是每次游戏更新的时间，乘于dt将会60帧也就是一秒移动speed的值
    this.x += (this.move.left + this.move.right) * this.speed * dt;
    this.y += (this.move.top + this.move.bottom) * this.speed * dt;

    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x))
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y))

    // 每帧都减少开火延迟
    this.fireTime -= dt;
    // 判断是否开火
    if(this.fire != false){
      // 如果没有延迟了就返回一个bullet对象
      if(this.fireTime <= 0){
        // 将延迟重新设置
        this.fireTime = Constants.PLAYER.FIRE;
        // 创建一个bullet对象，将自身的id传递过去，后面做碰撞的时候，就自己发射的子弹就不会打到自己
        return new Bullet(this.id, this.x, this.y, this.fireMouseDir);
      }
    }
  }
   serializeForUpdate(){
       return {
           ...(super.serializeForUpdate()),
           username:this.username,
           hp:this.update,
           buffs:this.buffs.map(item=>item.type)

       }
   }
}

module.exports = Player