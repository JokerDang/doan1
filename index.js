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
let token = "EAAUxqHfEQqYBABKQ3dYRxqsZACLAU5fNquHcDqyOKy0VXsZBquD3O3xZCeM05P6bVaByWXGuP1hBY6LhNfHdOEDSEPmFOt8DDWLNN4c3OeBTrGm7y166vNl7hk8Ljcf7ywpYTvfRKmYZCTnaZBaUg433AJxZCl3BX36YyRnugbGQZDZD"

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

