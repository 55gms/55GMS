export class CoroutineYield {
  constructor(){

  }
  process(){
  	return new Promise((resolve, reject)=>{
    	resolve()
    })
  }
}

export class WaitForSeconds extends CoroutineYield{
  constructor(time){
    super()
    this.time = time
  }

  process(){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve()
      }, this.time*1000)
    })
  }
}