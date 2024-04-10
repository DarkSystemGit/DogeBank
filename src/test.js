import { Database,Account,Company } from "./data.js";
import * as path from 'path'
import * as process from 'process'
var db=new Database(path.join(process.cwd(),'main.db'))
console.log(db.db)