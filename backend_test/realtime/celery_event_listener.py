# celery_event_listener.py
import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from celery import Celery
from celery.signals import task_success, task_failure, task_revoked, task_prerun

channel_layer = get_channel_layer()

def announce_task_event(task_id, state):
    room_group_name = f'{task_id}'
    
    # Send message to the room group
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            'type': 'task_message',
            'message': json.dumps({'task_id': task_id, 'state': state})
        }
    )
    
# Celery Signal handlers
@task_success.connect
def task_success_handler(sender=None, result=None, **kwargs):
    announce_task_event(sender.request.id, 'SUCCESS')

@task_failure.connect
def task_failure_handler(sender=None, exception=None, traceback=None, **kwargs):
    announce_task_event(sender.request.id, 'FAILURE')

@task_prerun.connect
def task_prerun_handler(sender=None, task_id=None, task=None, **kwargs):
    announce_task_event(task_id, 'STARTED')

@task_revoked.connect
def task_revoked_handler(sender=None, **kwargs):
    announce_task_event(sender.request.id, 'REVOKED')
