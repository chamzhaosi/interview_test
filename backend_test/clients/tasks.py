from celery import shared_task
from .serializers import ClientRegistrationSerializer

@shared_task
def create_user_task(user_data):
    createSerializer = ClientRegistrationSerializer(data=user_data)
    createSerializer.is_valid(raise_exception=True) # Django will handle error 
    createUser = createSerializer.save()
    
    return {"Message":"User Create Successfully."}

