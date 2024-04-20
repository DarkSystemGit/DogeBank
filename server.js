import express from 'express'
import expressWs from 'express-ws'
import requestID from 'express-request-id';
import morgan from 'morgan'
import path from 'path'
import {server} from './server/server.js'
import 'dotenv/config'
const __dirname = import.meta.dirname;
const wsServer=expressWs(express())
const app = wsServer.app
const port = process.env.PORT || 8083
app.use(express.static(path.join(__dirname, 'ui/dist')))
app.use(requestID({setHeader:false}))
morgan.token('id', (req) => {
    req.id.split('-')[0]
})
app.use(
    morgan(
        "[:date[iso] #:id] Started :method :url for :remote-addr",
        {
            immediate: true
        }
    )
)
app.ws('/',(s,req)=>{})
server(wsServer.getWss('/'))
app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
})
