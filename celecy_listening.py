from celery import Celery
from celery.events.receiver import EventReceiver
import websocket
import threading
import json

app = Celery('proj', broker='redis://127.0.0.1:6379/0')

def on_message(ws, message):
    print("Received message: ", message)

def on_error(ws, error):
    print("Error: ", error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    def run(*args):
        # Keep the connection open
        while True:
            pass  # Just pass as we don't want to close the loop

    thread = threading.Thread(target=run)
    thread.start()

# Set up WebSocket connection
ws = websocket.WebSocketApp("ws://localhost:8000/ws/call/1232/",
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)
ws.on_open = on_open
threading.Thread(target=ws.run_forever).start()

def announce_task_event(event):
    task_id = event['uuid']
    state = event['type']
    # Emit the event to the frontend via WebSocket
    data = json.dumps({'task_id': task_id, 'state': state})
    ws.send(data)

def main():
    with app.connection() as connection:
        receiver = EventReceiver(connection, handlers={
            'task-succeeded': announce_task_event,
            'task-failed': announce_task_event,
            'task-started': announce_task_event,
            # You can add more event types based on your needs
        })
        receiver.capture(limit=None, timeout=None, wakeup=True)

if __name__ == '__main__':
    main()
