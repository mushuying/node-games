class Item{
    constructor(data={}){
        this.id = data.id

        this.x = data.x
        this.y = data.y

        this.w = data.w
        this.h = data.h
    }
    update(dt){

    }
    serializeForUpdate(){
        return {
            id:this.id,
            x:this.x,
            y:this.y,
            w:this.w,
            h:this.h
        }
    }
}
module.exports = Item