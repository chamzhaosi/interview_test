task_id = "fa362ca4-62a9-4f41-8046-68e536176e85"
ws = new WebSocket('ws://localhost:8000/ws/call/'+task_id+'/')
ws.onmessage = (data) => {
    console.log(data.data) 


    if (JSON.parse(data.data)['type'] === "connection") {
        ws.send(JSON.stringify({
            "type":"check",
            "data":{
                "task_id":task_id
            }})
        )
    }

    if (JSON.parse(data.data)['status'] === "SUCCESS" || JSON.parse(data.data)['status'] === "INVALID" || JSON.parse(data.data)['status'] === "ERROR" ){
        ws.send(JSON.stringify({
            "type":"delete",
            "data":{
                "task_id":task_id
            }})
        )
    }

    if (JSON.parse(data.data)['status'] === "DELETED"){
        ws.close()
    }
    
    
    // ws.close()
}


