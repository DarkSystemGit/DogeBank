import * as postmark from 'postmark'
import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'
var mail=new postmark.ServerClient(process.env.POSTMARK_API_KEY)
var emails={
    'emailVerification':'Verify Your Email',
    'merchantOrder':'New Order!',
    'orderCompletion':'Your Order',
    'passwordReset':'Reset Your Password'
}
function template(name,options){
    var temp=fs.readFileSync(path.join(process.cwd(),'/src/emails',name+'.html'))
    Object.keys(options).forEach((key)=>{temp=temp.replaceAll('${'+key+'}',options[key])})
    return temp
}
export async function email(type,options,email){
    return await mail.sendEmail(
        {From:'no-reply@dogebankapp.com',To:email}
    )
}
