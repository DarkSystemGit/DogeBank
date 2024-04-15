import * as data from './data.js'
import { rpc } from './rpc.js'
import * as path from 'path'
import * as process from 'process'
var db = new data.Database(path.join(process.cwd(), 'main.db'));
var sessions = db.db.sessions
var getUser=(session) => {
    console.log(sessions)
    return db.getEntry('accounts.'+sessions[session])
}
rpc.on('createUser', (name, password,icon,email) => {
    var user = new data.Account({ name, icon, balance: 0, sessions: [], login: '',email }, db)
    user.setLogin(password)
})
rpc.on('removeUser',(name)=>{
    db.remove(`accounts.${name}`)
})
rpc.on('login', (name, login) => {
    try {
        var user = new data.Account(db.getEntry(`accounts.${name}`), db)
        console.log(user.checkLogin(login))
        if (user.checkLogin(login)) {
            var session = user.generateSession();
            sessions[session]=user.account.name
            console.log(session)
            return session
        }else{
            return false
        }
    } catch {
        return false
    }
})
rpc.on('createCompany', (name, users) => {
    var comp = new data.Company({ name, stockholders: {}, products: {}, stockPrice: 0 }, db)
    users.forEach(user => {
        comp.addOwner(new data.Account(db.getEntry(`accounts.${user}`), db))
    });
})
rpc.on('createProduct', (name, img, desc, cost, stock, company) => {
    var comp = new data.Company(db.getEntry(`companies.${company}`), db)
    comp.createProduct({ name, cost, img, desc, stock })
})
rpc.on('search', (category, term, length) => {
    return db.search(category, term, { amount: length })
})
rpc.on('getUser', getUser)
rpc.on('buyItem',(session,id)=>{
    return new data.Product(db.getEntry('prodIds.'+id),db).buy(new data.Account(getUser(session),db))
})
rpc.on('exchange',(amount,type)=>{
    //Type 1 means from USD to DogeCoins
    //Type 2 is the opposite
    
})
rpc.create(8080)