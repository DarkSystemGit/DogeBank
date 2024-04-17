import * as data from './data.js'
import {email} from './email.js'
import { rpc } from './rpc.js'
import * as path from 'path'
import * as process from 'process'

var db = new data.Database(path.join(process.cwd(), 'main.db'));
var sessions = db.db.sessions
function on(msg, func) {
    if (!['login', 'createUser', 'editUser'].includes(msg)) {
        rpc.on(msg, (s) => { if (sessions[s]) func(...arguments) })
    } else {
        rpc.on(msg, func)
    }
}
var getUser = (session) => {
    console.log(sessions)
    return db.getEntry('accounts.' + sessions[session])
}
var createUser = (name, password, icon, email) => {
    var user = new data.Account({ name, icon, balance: 0, sessions: [], login: '', email }, db)
    user.setLogin(password)
}
on('createUser', createUser)
on('editUser', createUser)
on('removeUser', (s, name) => {
    db.remove(`accounts.${name}`)
})
on('login', (name, login) => {
    try {
        var user = new data.Account(db.getEntry(`accounts.${name}`), db)
        console.log(user.checkLogin(login))
        if (user.checkLogin(login)) {
            var session = user.generateSession();
            sessions[session] = user.account.name
            console.log(session)
            return session
        } else {
            return false
        }
    } catch {
        return false
    }
})
on('signout', (session) => {
    var user = new data.Account(getUser(session), db)
    user.sessions.filter(e => e !== session)
    user.serialize()
    delete sessions[session]
    db.writeDB()
})
on('createCompany', (s, name, users, logo) => {
    var comp = new data.Company({ name, stockholders: {}, products: {}, stockPrice: 0, logo }, db)
    users.forEach(user => {
        comp.addOwner(new data.Account(db.getEntry(`accounts.${user}`), db))
    });
})
on('createProduct', (s, name, img, desc, cost, stock, company) => {
    var comp = new data.Company(db.getEntry(`companies.${company}`), db)
    comp.createProduct({ name, cost, img, desc, stock })
})
on('getProduct',(s,id)=>{
    return db.getEntry('prodIds.' + id)
})
on('search', (s, category, term, length) => {
    return db.search(category, term, { amount: length })
})
on('getUser', getUser)
on('buyItem', (session, id,amount) => {
    return new data.Product(db.getEntry('prodIds.' + id), db).buy(new data.Account(getUser(session), db),amount)
})
on('exchange', (s, amount, type,emailObj) => {
    //Type 1 means from USD to DogeCoins
    //Type 2 is the opposite
    var user=new data.Account(getUser(s),db)
    if(type==1){
        user.setBalance(amount)
        email('exchangeDC',emailObj,user.account.email)
    }else{
        user.setBalance(amount*-1)
        email('exchangeUSD',emailObj,user.account.email)
    }
})
on('transfer', (session, to, amount) => {
    var user = new data.Account(getUser(session), db)
    var to = new data.Account(db.getEntry('accounts.' + to), db)
    to.setBalance(amount)
    user.setBalance(-1 * amount)
})
on('list', (s, type, amount) => {
    var res = db.getEntry(type)
    if (res.length > amount) res = res.slice(0, amount)
    return res
})
on('getCompany', (s, name) => {
    return db.getEntry('companies.' + name)
})
on('addOwner', (s, company, user) => {
    var comp = new data.Company(db.getEntry(`companies.${company}`), db)
    comp.addOwner(new data.Account(db.getEntry(`accounts.${user}`), db))
})
on('editCompany',(s,name,logo)=>{
    var comp = new data.Company(db.getEntry('companies.' + name), db)
    comp.company.name=name
    comp.company.logo=logo
    comp.serialize()
})
on('getCart',(session)=>{
    return new data.Account(getUser(session), db).getCart()
})
on('removeItemFromCart',(session,id)=>{
    new data.Account(getUser(session), db).removeProductfromCart(id)
})
on('buyStock',(session,company,amount)=>{
    var user = new data.Account(getUser(session), db)
    var comp = new data.Company(db.getEntry(`companies.${company}`), db)
    comp.buyStock(user,amount)
})
on('sellStock',(session,company,amount)=>{
    var user = new data.Account(getUser(session), db)
    var comp = new data.Company(db.getEntry(`companies.${company}`), db)
    comp.sellStock(user,amount)
})
rpc.create(8080)