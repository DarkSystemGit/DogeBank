import * as msgpack from 'msgpackr'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import * as process from 'process'
if (process.argv[2] == "read") {
    console.dir(msgpack.unpack(fs.readFileSync(path.join(process.cwd(), 'main.db'))), { depth: null })
} else if (process.argv[2] == "write") {

    fs.writeFileSync(path.join(process.cwd(), 'main.db'), 
    msgpack.pack(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'main.json')))))

}