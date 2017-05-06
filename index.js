
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs=require('fs')
const app = express()
var _ = require('lodash')
var jsonData = require("./data.json");
app.set('port', (process.env.PORT || 5000))
	
// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//json file

//end json file
// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAAUxqHfEQqYBAHAX9KzD32TSD4GjLLjVhGvErUqJ1AV1GfZCGiAi3M3ZC9pD053s79JHiGTbc8PuLhTMZAOWv9LzwPtsSUeUYcyCzo8I4fBJK6sC8wjrJ7YWTsstI6I3NOeHZBaC4s3JmTLTOZAOlYw4gLM9tHzoUCJnGaqicOAZDZD"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "joker") {
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
			decideMessage(sender,text)
		}
	}
	res.sendStatus(200)
})
function decideMessage(sender, text1) {
	let text = text1.toLowerCase();
	var rep = null;
	for (let i = 0; i < jsonData.length; i++) {
		// Bạn nhầm lẫn ở đây nhé.
		if (text.includes(jsonData[i].keyword)) { // "abc" includes  "a"
			rep = jsonData[i].rep;
			break; // `break` to exit a loop in For Loop Statement
		}
	};
	if (!rep) return sendText(sender, text)
	else
		return sendText(sender, rep);
}app.get('/keyword', function (req, res) {
   fs.readFile( __dirname + "/" + "data.json", 'utf8', function (err, data) {
   	data=JSON.parse(data)
       console.log(data);
       res.end( data );
   });
})

function sendText(sender, text) {
	let messageData = {text: text}
	sendRequest(sender,messageData)
}
function sendRequest(sender,messageData)
{
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






