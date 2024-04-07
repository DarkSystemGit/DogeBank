import * as data from './data.js'
import { wmc } from './rpc'
import * as path from 'path'
import * as process from 'process'
var db = new data.Database(path.join(process.cwd(), 'db.json'));
wmc.on('createUser', (name, password) => {
    var user = new data.Account({ name,icon, balance: 0, sessions: [], login: '' }, db)
    user.setLogin(password)
})
wmc.on('login', (name, login) => {
    try {
        var user = new data.Account(db.getEntry(`accounts.${name}`), db)
        return user.checkLogin(login)
    } catch {
        return false
    }
})
wmc.on('createCompany',(name,users)=>{
    var comp=new data.Company({name,stockholders: {}, products: {}, stockPrice: 0},db)
    users.forEach(user => {
        comp.addOwner(new data.Account(db.getEntry(`accounts.${user}`), db))
    });
})
wmc.on('createProduct',(name,img,desc,cost,stock,company)=>{
    var comp=new data.Company(db.getEntry(`companies.${company}`),db)
    comp.createProduct({name,cost,img,desc,stock})
})
wmc.on('')
wmc.create(8080)