import {RPC} from './rpcClient.js'
import readline from 'readline'
import 'dotenv/config'
(async function(){
var rpc= new RPC()    
var channel=await rpc.createChannel('127.0.0.1',parseInt(process.env.PORT)||8083,false)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
var handler=async function(txt){
    txt=txt.split(' ')
    var args=txt.slice(1)
    args.forEach((arg,i) => {
      if(arg.includes('{')||arg.includes('['))args[i]=JSON.parse(arg)
      if(/^-?\d+\.?\d*$/.test(arg))args[i]=parseFloat(arg)
    });
    try{console.log(await rpc.sendMsg(channel,txt[0],...args))}catch(e){console.log(e)}
    console.log('\n')
    rl.question('>',handler)
}
rl.question('>',handler)})()