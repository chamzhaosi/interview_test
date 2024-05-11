ws = new WebSocket('ws://localhost:8000/ws/call/cham/')
ws.onmessage = (data) => {
    console.log(data.data)

    ws.send(JSON.stringify({
        "type":"login",
        "data":{
            "name":"cham test"
        }})
    )
    
    ws.close()
}


