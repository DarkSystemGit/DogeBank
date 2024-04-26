import { BSON } from "bson"
import * as fs from 'fs'
import * as zlib from 'zlib'
export function write(file,data){
    return fs.writeFileSync(file,zlib.deflateSync(BSON.serialize(data)))
}
export function read(file){
    return BSON.deserialize(zlib.inflateSync(fs.readFileSync(file)))
}