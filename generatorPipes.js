var consume = i =>{
  var I = i.next()
  while (!I.done){
    console.log(I.value)
    I = i.next()  
} }

function* x(i){
  for(let I of i){
  var d = 0
  for(let i=1000000000;i>0;i--){
    d+=i
  }
    yield I * 2
  }
}

function* y(i){for(let I of i)yield I * 3}

consume(x([1,2,3]))      //=> 2 , 4 , 6
consume(x(y([1,2,3])))   //=> 6 , 12 , 18

var pipe = (I,O,...l) =>{
  var res = I
  for(let f of l){
    res=f(res)
  }
  return (x=>{
    var i = x.next()
    while(!i.done){
        O(i.value)
        i=x.next()
    }
  })(res)
}

pipe([1,2,3],(_)=>console.log(_),x,y) //=> 6 , 12 , 18
