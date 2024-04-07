import { Database,Account,Company } from "./data.js";
import * as path from 'path'
import * as process from 'process'
var db=new Database(path.join(process.cwd(),'test.db'))
var bob=new Account({name:'Bob',balance:100,sessions:[],login:''},db)
bob.setLogin('abc123')

var JimCo=new Company({name:'JimCo',stockholders:{},products:{},stockprice:0},db)
JimCo.createProduct({name:'jim',cost:5,img:'',desc:'A human named Jim',stock:5})
JimCo.addOwner(bob)
console.log(db)