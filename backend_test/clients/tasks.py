from celery import shared_task
from .serializers import ClientRegistrationSerializer
import time

@shared_task
def create_user_task(user_data):
    print("start sleep")
    time.sleep(35)
    createSerializer = ClientRegistrationSerializer(data=user_data)
    createSerializer.is_valid(raise_exception=True) # Django will handle error 
    createUser = createSerializer.save()
    
    return {"Message":"User Create Successfully."}

