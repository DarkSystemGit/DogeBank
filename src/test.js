import { Database,Account } from "./data.js";
import * as path from 'path'
import * as process from 'process'
var db=new Database(path.join(process.cwd(),'test.db'))
var bob=new Account({name:'Bob',balance:100,sessions:[],login:'abc123'},db)
if(!db.exists())bob.serialize()
console.log(db.db,db.getEntry('accounts.Bob'))
