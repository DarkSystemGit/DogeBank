import * as fs from 'fs'
import * as crypto from 'crypto'
import fuzzysort from 'fuzzysort'
import * as dbfile from './dbfile.js'
function genUUID() {
    var bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return bytes.toString('hex');
}
export class Database {
    constructor(path, schema) {
        if (fs.existsSync(path)) {
            this.loaded = true
            this.db = dbfile.read(path)
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
        dbfile.write(this.file,this.db)
        this.db=dbfile.read(this.file)
    }
    exists() {
        return !!this.loaded
    }
    createLink(from, to) {

        if (!(this.db[from.split('.')[0]]) || (this.getEntry(from) != `\${${to}}`)) this.create(from, `\${${to}}`)
    }
    search(path, term, options) {
        var entry = this.getEntry(path)
        var results = []
        if (options.key) {

            var keys = fuzzysort.go(term, Object.values(entry), { key: options.key, limit: options.amount })
            keys.forEach((key) => {
                results.push(key.obj)
            })
        } else {
            var keys = fuzzysort.go(term, Object.keys(entry), { limit: options.amount })
            keys.forEach((key) => {
                results.push(entry[key.target])
            })
        }
        return results
    }
}
export class Account {
    constructor(account, database) {
        this.account = account || { name: '', sessions: [], balance: 0, login: '', icon: '',stocks:[] }
        this.db = database
        this.account.cart = this.account.cart || {}
        this.account.stocks = this.account.stocks || []
        this.account.payments=this.account.payments||[]
        if (!this.db.db.accounts.hasOwnProperty(account.name)) database.createLink('logins.' + account.name, 'accounts.' + account.name + '.login')
        this.serialize()
    }
    serialize() {
        this.db.create('accounts.' + this.account.name, this.account)
    }
    setBalance(balance) { this.account.balance += balance; this.serialize() }
    generateSession() {
        var sessionKey;
        var bytes = crypto.randomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        sessionKey = bytes.toString('hex');
        this.account.sessions.push(sessionKey)
        this.db.create('sessions.' + sessionKey, this.account.name)
        this.serialize()
        return sessionKey
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
    getCart() { return this.account.cart }
    removeProductfromCart(id) {
        delete this.account.cart[id]
        this.serialize()
    }
}
export class Product {
    constructor(prod, database) {
        this.product = prod || { name: '', cost: 0, img: '', desc: '', stock: 0 }
        this.product.id = this.product.id || genUUID()
        if (!database.db.products.hasOwnProperty(prod.name)) database.createLink('prodIds.' + this.product.id, 'products.' + this.product.name)
        this.db = database
        this.serialize()
    }
    serialize() {
        this.db.create('products.' + this.product.name, this.product)
    }
    buy(account, amount) {
        account.account.payments.push({ company: this.product.company, amount: (this.product.cost * amount) * -1, status: (!this.product.stock == 0) && (account.account.balance >= this.product.cost) })
        if ((!this.product.stock == 0) && (account.account.balance >= this.product.cost)) {
            this.product.stock = this.product.stock - amount
            account.account.cart[this.product.id] = { name: this.product.name, amount }
            account.setBalance((this.product.cost * amount) * -1)
            var comp = new Company(this.db.getEntry(this.product.company), this.db)
            comp.addOrder({ id: this.product.id, amount })
            comp.updateValue(this.product.cost * amount)
            this.serialize()
            return true
        } return false
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
        this.company = company || { name: '', stockholders: {}, products: {}, value: 0 }
        this.db = database
        this.company.orders = [] || this.company.orders
        this.company.stocks = this.company.stocks || 0
        this.company.revenue=this.company.revenue||{[new Date().toJSON().split('T')[0]]:0}
        this.serialize()
    }
    createProduct(product) {
        product.company = `\${companies.${this.company.name}}`
        new Product(product, this.db)
        this.company.products[product.name] = `\${products.${product.name}}`
    }
    buyStock(account, amount) {
        var price = this.company.value / this.company.stocks
        account.account.payments.push({ company: this.company.name, amount: price * -1, status: account.account.balance >= price })
        if (account.account.balance >= price) {
            account.account.stocks.push(this.company.name)
            account.setBalance((price * amount) * -1)
            this.company.stocks += amount
            this.updateValue(price * amount)
            this.serialize()
            return true
        } return false
    }
    sellStock(account, amount) {
        var price = this.company.value / (this.company.stocks - amount)
        account.account.payments.push({ company: this.company.name, amount: price, status: account.account.stocks.includes(this.company.name) })
        if (account.account.stocks.includes(this.company.name)) {
            account.setBalance((price * amount))
            this.company.stocks -= amount
            this.updateValue((price * amount)*-1)
            this.serialize()
            return true
        } return false
    }
    addOwner(account) {
        this.serialize()
        this.db.createLink('companies.' + this.company.name + '.stockholders.' + account.account.name,'accounts.' + account.account.name)
        this.company=this.db.getEntry(`companies.${this.company.name}`)
        this.serialize()
    }
    addOrder(obj) {
        this.orders.push(obj)
        this.serialize()
    }
    removeProduct(name) {
        delete this.company.products[name]
        this.serialize()
    }
    serialize() {
        this.db.create('companies.' + this.company.name, this.company)
    }
    updateValue(value){
        this.company.value=value
        if((!this.company.revenue[new Date().toJSON().split('T')[0]])||(this.company.revenue[new Date().toJSON().split('T')[0]]<value)){
            this.company.revenue[new Date().toJSON().split('T')[0]]=value
        }
    }
}