import {emitControl} from './networking'

function onKeydown(ev){
    let code = ev.keyCode
    switch(code){
        case 65:
        emitControl({
            action: 'move-left',
            data: false
        })
        break;
        case 68:
        emitControl({
            action: 'move-right',
            data: true
        })
        break;
        case 87:
        emitControl({
            action: 'move-top',
            data: false
        })
        break;
        case 83:
        emitControl({
            action: 'move-bottom',
            data: true
        })
        break;
   }

}
function onKeyup(ev){
    let code = ev.keyCode;
    switch(code){
      case 65:
        emitControl({
          action: 'move-left',
          data: 0
        })
        break;
      case 68:
        emitControl({
          action: 'move-right',
          data: 0
        })
        break;
      case 87:
        emitControl({
          action: 'move-top',
          data: 0
        })
        break;
      case 83:
        emitControl({
          action: 'move-bottom',
          data: 0
        })
        break;
    }
  }

  //这里使用atan2获取鼠标相对屏幕中心的角度
  function getMouseDir(ev){
    const dir = Math.atan2(ev.clientX - window.innerHeight/2,en.clientY - window.innerHeight/2)
    return dir
 }
 // 每次鼠标移动，发送方向给后端保存
 function onMousemove(ev){
     if(ev.button===0){
         emitControl({
             action:'dir',
             data:getMouseDir(ev)
         })
     }
 }
 // 开火
function onMousedown(ev){
   if(ev.button === 0){
     emitControl({
       action: 'bullet',
       data: true
     })
   }
 }
 // 停火
function onMouseup(ev){
   if(ev.button === 0){
     emitControl({
       action: 'bullet',
       data: false
     })
   }
 }

  export  function startCapturingInput(){
      window.addEventListener('keydown',onKeydown)
      window.addEventListener('keyup', onKeyup);
      window.addEventListener('mouseup', onMouseup)
  }

  export function stopCapturingInput(){
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('keyup', onKeyup);
    window.removeEventListener('mouseup', onMouseup)
  }

   