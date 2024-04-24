var msgs = {}
var msgsDone = []
var store={}
async function buildMsg(msg, params, conn, initId) {
    if (!(store.initId == undefined)) {
        initId = store.initId
    }
    var id = initId
    if (initId == undefined) {
        id = new Date().getTime()
        store.initId = id
        send(conn, { type: '__init', id })
    }
    var clientId = await response(id)
    var msgId = new Date().getTime()
    var obj = { type: msg, clientId, params, id: msgId }
    return { msg: obj, msgId }
}

function ws(host, port, tls) {
    return new Promise((resolve,reject) => {
        if (tls == true) {
            tls = 's'
        } else {
            tls = ''
        }
        var ws = new WebSocket(`ws${tls}://${host}:${port}`)
        ws.addEventListener('error', e => reject(e))
        ws.onopen = () => {
            ws.onmessage = (msg) => {
                msg = JSON.parse(msg.data)
                msgs[msg.id] = msg
                msgsDone.push(msg.id)
            }
            resolve(ws)
        }
    })

}
function send(ws, msg) {
    ws.send(JSON.stringify(msg))
}
async function response(id) {
    return new Promise((resolve) => {
        var iterations = 1
        setTimeout(function resHand() {
            if (msgsDone.includes(id)) {
                resolve(msgs[id])
            } else {
                if (!(iterations == 50)) {
                    setTimeout(resHand, 100)
                }
            }
        }, 100)
    })
}
export function RPC() { }
RPC.prototype.createChannel = async function (host, port, tls) {
    var wsc = await ws(...arguments)
    return wsc
}

RPC.prototype.sendMsg = async function (cinfo, msg) {
    var ws = cinfo
    var params = Array.prototype.slice.call(arguments, 2)
    var msg = await buildMsg(msg, params, ws)
    send(ws, msg.msg)
    var res = await response(msg.msgId)
    if (res.status == 'ok') {
        return res.res
    } else {
        throw new Error(JSON.stringify(res))
    }

}
RPC.prototype.close=(cinfo)=>{
    cinfo.close()
}
