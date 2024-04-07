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
            
            if ((typeof prev[cur] == 'string') && prev[cur].includes('${') && (prev[cur][prev[cur].length - 1] == '}')) {
                return this.getEntry(prev[cur].replaceAll('${', '').slice(0, -1))
            }
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
                
                if ((typeof prev[cur] == 'string') && prev[cur].includes('${') && (prev[cur][prev[cur].length - 1] == '}')) { return this.create(prev[cur].replaceAll('${', '').slice(0, -1), value); }
                prev[cur] = value
                return;
            }; return prev[cur]
        }, this.db)
        this.writeDB()
    }
    remove(name) {
        this.create(name, undefined)
    }
    writeDB() {
        fs.writeFileSync(this.file, JSON.stringify(this.db))
    }
    exists() {
        return !!this.loaded
    }
    createLink(from, to) {
       
        if (!(this.db[from.split('.')[0]])||(this.getEntry(from) != `\${${to}}`)) this.create(from, `\${${to}}`)
    }
}
export class Account {
    constructor(account, database) {
        this.account = account || { name: '', sessions: [], balance: 0, login: '' }
        this.db = database
        database.createLink('logins.' + account.name, 'accounts.' + account.name + '.login')

    }
    serialize() {
        this.db.create('accounts.' + this.account.name, this.account)
    }
    setBalance(balance) { this.accounts.balance += balance; this.serialize() }
    generateSession() {
        var sessionKey;
        var bytes = crypto.randomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        sessionKey = bytes.toString('hex');
        this.account.sessions.push(sessionKey)
        this.serialize()
    }
    setLogin(pass) {
        var hash = crypto.createHash('sha512')
        hash.update(pass)
        this.account.login = hash.digest('hex')
        this.serialize()
    }
    checkLogin(pass) {
        var hash = crypto.createHash('sha512')
        hash.update(pass)
        return this.account.login == hash.digest('hex')
    }

}
export class Product {
    constructor(prod, database) {
        this.product = prod || { name: '', cost: 0, img: '', desc: '', stock: 0 }
        this.db = database
        this.serialize()
    }
    serialize() {
        this.db.create('products.' + this.product.name, this.product)
    }
    buy(account) {
        if (this.product.stock == 0) {
            this.product.stock--
            account.setBalance(this.product.cost * -1)
            this.serialize()
        } return 'out'
    }
    getListing() {
        var prod = this.product
        return prod
    }
    setPrice(price) {
        this.product.price += price; this.serialize()
    }
}
export class Company {
    constructor(company, database) {
        this.company = company || { name: '', stockholders: {}, products: {}, stockPrice: 0 }
        this.db = database
        this.serialize()
    }
    createProduct(product) {
        new Product(product, this.db)
        this.company.products[product.name] = `\${products.${product.name}}`
    }
    updateStock(price) {
        this.company.stockPrice += price
    }
    addOwner(account) {
        this.db.createLink('companies.' + this.company.name+'.stockholders.'+account.account.name,'accounts.'+account.account.name)
    }
    removeProduct(name) {
        delete this.company.products[name]
    }
    serialize() {
        this.db.create('companies.' + this.company.name, this.company)
    }
}