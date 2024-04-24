import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import * as process from 'process'
if (process.argv[2] == "read") {
    if(process.argv[3]!="json"){
        console.dir(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'main.db'))), { depth: null })
    }else{
        console.log(JSON.stringify(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'main.db')))))
    }
} else if (process.argv[2] == "write") {

    fs.writeFileSync(path.join(process.cwd(), 'main.db'), 
    JSON.stringify(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'main.json')))))
    //console.log(JSON.stringify(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'main.json')))))
}