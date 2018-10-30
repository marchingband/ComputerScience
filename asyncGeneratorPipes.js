<script src="https://cdnjs.cloudflare.com/ajax/libs/preact/8.3.1/preact.js"></script>
<div id="root"></div>
<script>
const {h,render:setDOM} = preact

function main(i){
  i = render(i)
  return i
}

async function* render(i){
  const start = h('div',null,
	  h('div',{onClick:()=>{send({type:'up'})}},'up'),
	  h('div',null,0),
	  h('div',{onClick:()=>{send({type:'down'})}},'down')
  )
  yield {type:'render',value:start}

  var state=0

  for await(let I of i){
    switch(I.type){
      case 'value' :
        yield {
          type:'render',
          value:h('div',null,
				        h('div',{onClick:()=>{send({type:'up'})}},'up'),
				        h('div',null,state),
				        h('div',{onClick:()=>{send({type:'down'})}},'down'))
        }
        break;
      case 'up' :
        state++
        send({type:'value',value:state})
        break;
      case 'down' :
        state--
        send({type:'value',value:state})
        break;        
    }
    yield I
  }
}

let callback
const queue = []

function send(event) {
  console.log(event)
  if (!queue.length && callback)
    callback()
  queue.push(event)
}

async function* produce() {
  for(;;) {
    while(queue.length)
      yield queue.shift()
    await new Promise(i => callback = i)
  }
}

async function consume(input) {
  for await(const i of input) {
    if(i.type=='render'){
	    root=setDOM(i.value, document.body, root);
    }
  }
}

function share(iterable) {
  const iterator = iterable[Symbol.asyncIterator]()
  return {
    next(value) { return iterator.next() },
    [Symbol.asyncIterator]() { return this }
  }
}

window.setTimeout(() => {
  consume(main(produce()))
}, 1000);
