import * as fs from 'fs'
import * as crypto from 'crypto'
export class Database {
    constructor(path, schema) {
        if (fs.existsSync(path)) {
            this.loaded = true
            this.db = JSON.parse(fs.readFileSync(path))
        } else {
            this.db = schema || {}
        }
        this.file = path
    }
    getEntry(name) {
        this.writeDB()
        return name.split('.').reduce((prev, cur) => {
            if((typeof prev[cur]=='string')&&prev[cur].includes('${')&&prev[cur].includes('}')){return this.getEntry(prev[cur])}
            return prev[cur]
        }, this.db)
    }
    update() {
        this.create(...arguments)
    }
    create(name, value) {
        name.split('.').reduce((prev, cur, i) => {
            prev[cur] = prev[cur] || {};
            if (i == name.split('.').length - 1) {
                if((typeof prev[cur]=='string')&&prev[cur].includes('${')&&prev[cur].includes('}')){return this.create(prev[cur],value);}
                prev[cur] = value
                return;
            }; return prev[cur]
        }, this.db)
        this.writeDB()
    }
    remove(name){
        this.create(name,undefined)
    }
    writeDB() {
        fs.writeFileSync(this.file, JSON.stringify(this.db))
    }
    exists() {
        return !!this.loaded
    }
    createLink(from,to ){
        this.create(from,`\${${to}}`)
    }
}
export class Account {
    constructor(account, database) {
        this.account = account||{name:'',sessions:[],balance:0,login:''}
        this.db = database
        database.createLink('logins.'+account.name,'accounts.' + account.name+'.login')
        
    }
    serialize() {
        this.db.create('accounts.' + this.account.name, this.account)
    }
    setBalance(balance) { this.balance += balance }
    generateSession() {
        var sessionKey;
        var bytes = crypto.randomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        sessionKey = bytes.toString('hex');
        this.account.sessions.push(sessionKey)
    }
    setLogin(pass){
        var hash=crypto.createHash('sha512')
        hash.update(pass)
        this.account.login=hash.digest('hex')
    }
    checkLogin(pass){
        var hash=crypto.createHash('sha512')
        hash.update(pass)
        return this.account.login==hash.digest('hex')
    }

}