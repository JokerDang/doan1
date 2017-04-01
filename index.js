'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

//Cho phép chúng ta xử lý dữ liệu
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Nội dung hiển thị  app của heroku
app.get('/', function(req, res) {
	res.send("Tao la chatbot")
})
; 
//Mã truy cập trang
let token = "EAAUxqHfEQqYBAM2EZBDYnMbMjoW1vpVtMdAN86tWneXZCQIEkSnL8FekWailX1SA3ZCqBd2xAgZAJ4jXdw7zbNHUfDA00ZCMvBtvXfow0hZCroAglk2ZCZAZBv4LAEGd5YgiRQYDdneaLmWn5JJiQvkUk6XwtcVof9pVuwduT7GgtYAZDZD"

// Facebook 
app.get('/webhook', function(req, res) {
	if (req.query['hub.verify_token'] ==="minhdong") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender,text)//In tin nhan nguoi dung
			if(text.includes("Học phí")){
				sendText(sender,"5m/hk")
			}
			else
			sendText(sender,text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})

curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"USER_ID"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://petersapparel.parseapp.com",
            "title":"Show Website"
          },
          {
            "type":"postback",
            "title":"Start Chatting",
            "payload":"USER_DEFINED_PAYLOAD"
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v2.6/me/messages?access_token="EAAUxqHfEQqYBAM2EZBDYnMbMjoW1vpVtMdAN86tWneXZCQIEkSnL8FekWailX1SA3ZCqBd2xAgZAJ4jXdw7zbNHUfDA00ZCMvBtvXfow0hZCroAglk2ZCZAZBv4LAEGd5YgiRQYDdneaLmWn5JJiQvkUk6XwtcVof9pVuwduT7GgtYAZDZD"