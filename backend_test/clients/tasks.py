from celery import shared_task
from .serializers import ClientRegistrationSerializer, TmpRegisterStatusSerializer
from django.db import transaction
import time

@shared_task(bind=True)
def create_user_task(self, user_data):
    try:
        with transaction.atomic(): # Rollback if got problem
            createSerializer = ClientRegistrationSerializer(data=user_data)
            if createSerializer.is_valid(): # Django will handle error 
                createUser = createSerializer.save()
                status = "SUCCESS"
                remark = "User Create Successfully."
                
                # before return the message, save the task status into db
                save_task_status(self.request.id, status, remark)
                return {status:remark}
          
            else:
                status = "INVALID"
                remark = ""
                print(createSerializer.errors)
                for _, errors in createSerializer.errors.items():
                    remark += ' '.join(str(e) for e in errors) + " "
                
                # before return the message, save the task status into db
                save_task_status(self.request.id, status, remark)
                return {status:remark}
        
    except Exception as ex:
        status = "ERROR"
        remark = str(ex)
        
        # before return the message, save the task status into db
        save_task_status(self.request.id, status, remark)
        return {status: remark}
    

# if not problem, then insert the task_id and status to TmpRegisterStatus
def save_task_status(task_id, status, remark):
    tmpRegsSerializer = TmpRegisterStatusSerializer(data={"task_id":task_id, "status":status, "remark":remark})
    if tmpRegsSerializer.is_valid():
        tmpRegsSerializer.save()
    
    