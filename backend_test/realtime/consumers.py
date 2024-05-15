import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from clients.models import TmpRegisterStatus

class CallConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['task_id']
        self.room_group_name = self.room_name
        
        # print("%s create group" %self.room_group_name)
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
     
        self.accept()

        # response to client, that we are connected.
        self.send(text_data=json.dumps({
            'type': 'connection',
            'data': {
                'message': "Connected"
            }
        }))

    def disconnect(self, close_code):
        # Leave room group
        # print("Leave room group %s" %self.room_group_name)

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from client WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        eventType = text_data_json['type']
        task_id = text_data_json['data']['task_id']

        # once connected with websocket, the query check whether the queue task ready or not
        if eventType == 'check':
            tmpRegResult = TmpRegisterStatus.objects.all().filter(task_id=task_id)
            
            # if have, then return status and remark
            if len(tmpRegResult):
                self.send(text_data=json.dumps({
                    'status': tmpRegResult[0].status,
                    'remark': tmpRegResult[0].remark
                }))
                
        else:
            # once get the status from 'check' or task_message, then it from TmpRegisterStatus db
            print("delete")
            if eventType == 'delete':
                print("delete 1")
                TmpRegisterStatus.objects.all().filter(task_id=task_id).delete()
                print("delete 3")
                self.send(text_data=json.dumps({
                    'status': "DELETED",
                    'remark': "The task id has been deleted"
                }))
                print("delete 4")

    # this will be invoke by celery_event_listener.py
    def task_message(self, event):
        message = event['message']
        
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'status': message['status'],
            'remark': message['remark']
        }))