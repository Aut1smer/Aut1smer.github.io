var net = require('net') // 获取tcp模块
var server = net.createServer() //创建tcp服务器
var message = [] //所有人的留言

//当服务器接收到一个客户端连接时
server.on('connection', (conn) => {

    // 连接上收到数据时，数据默认使用utf-8编码
    conn.on('data', data => {
        // console.log(data.toString());
        var str = data.toString() //假设浏览器一次就把内容全部发送过来了只触发一次data事件

        var [header, body] = str.split('\r\n\r\n')
        var [head, headers] = header.split('\r\n')
        var [method, url] = head.split(' ') //后面的内容不要

        console.log(method, url, body);

        if (url == '/liuyan' && method == 'POST') {
            let info = parseQueryString(body) //仅限于POST留言
            info.timeStamp = new Date().toString()
            message.push(info)
            console.log(info);
            conn.end()
        }

        if (url == '/') { //请求首页，返回留言板
          //响应头+响应体
            conn.write('HTTP/1.1 200 OKKKKKK\r\n')
            conn.write('Content-Type: text/html; charset=UTF-8\r\n')
            conn.write('\r\n')//区分响应头与响应体
            conn.write('<meta charset="UTF-8">')
            conn.write(`
          <h1>留言板${new Date()}</h1>
          <form action="/liuyan" method="POST">
          <fieldset>
            <legend>留言板</legend>
            Name<br />
            <input type="text" name="name"><br />
            COMMENT<br />
            <textarea name="message" cols="50" rows="5"></textarea><br />
            <button></button>
            </fieldset>
          </form>
          `)
            for (var i = message.length - 1; i >= 0; i--) {
                let msg = message[i]
                conn.write(`
              <div>
                  <h3>${msg.name}</h3>
                  <p>${msg.message}</p>
                  from ${msg.timeStamp}
              </div>
            `)
            }
            conn.end()
        }

        // conn.end()
    })
})

var port = 80

//让服务器开始监听
server.listen(port, () => {
        //监听成功后输出
        console.log('listening on port', port);
    }) //1024以下的端口在linux/mac里监听需要权限



// name=zhangsan&message=hello
// {name:'zhangsan', message:'hello'}
function parseQueryString(str) {
    let ary = str.split('&')
    let res = {}
    ary.forEach(it => {
        let [key, val] = it.split('=')
        res[key] = decodeURIComponent(val)
    })
    return res
}