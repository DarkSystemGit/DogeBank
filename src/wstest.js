import {RPC} from './rpcClient.js'
import readline from 'readline'
(async function(){
var rpc= new RPC()    
var channel=await rpc.createChannel('127.0.0.1',8080,false)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
var handler=async function(txt){
    txt=txt.split(' ')
    
    try{await rpc.sendMsg(channel,txt[0],...txt.slice(1))}catch(e){console.log(e)}
    console.log('\n')
    rl.question('>',handler)
}
rl.question('>',handler)})()