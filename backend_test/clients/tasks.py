from celery import shared_task
from .serializers import ClientRegistrationSerializer, TmpRegisterStatusSerializer
from .models import ClientsAccount
from django.db import transaction
import time

@shared_task(bind=True)
def create_user_task(self, user_data):
    try:
        with transaction.atomic(): # Rollback if got problem
                  
            # Check whether username or email      
            username_email_exists = ClientsAccount.objects.filter(username=user_data['username'], email=user_data['email']).exists()
            if username_email_exists:
                status = "ERROR"
                remark = "Both the username and email address you entered are already in use. Please choose different ones to continue."
                
                # before return the message, save the task status into db
                save_task_status(self.request.id, status, remark)
                return {"status":status, "remark":remark}
            
            
            # Check whether username or email
            username_exists = ClientsAccount.objects.filter(username=user_data['username']).exists()
            if username_exists:
                status = "ERROR"
                remark = "Username you entered are already in use."
                
                # before return the message, save the task status into db
                save_task_status(self.request.id, status, remark)
                return {"status":status, "remark":remark}
            
            
            # Check whether username or email
            email_exists = ClientsAccount.objects.filter(email=user_data['email']).exists()
            if email_exists:
                status = "ERROR"
                remark = "Email you entered are already in use."
                
                # before return the message, save the task status into db
                save_task_status(self.request.id, status, remark)
                return {"status":status, "remark":remark}
            
            # After checking if the username or email not exist in the db
            # then create the user account
            createSerializer = ClientRegistrationSerializer(data=user_data)
            if createSerializer.is_valid(): # Django will handle error 
                createSerializer.save()
                status = "SUCCESS"
                remark = "User Create Successfully."
                
                # before return the message, save the task status into db
                save_task_status(self.request.id, status, remark)
                return {"status":status, "remark":remark}
          
            else:
                status = "INVALID"
                remark = ""
                for field, errors in createSerializer.errors.items():
                    remark += field + " : " + " ".join(str(e) for e in errors) + " "
                
                # before return the message, save the task status into db
                save_task_status(self.request.id, status, remark)
                return {"status":status, "remark":remark}
        
    except Exception as ex:
        status = "ERROR"
        remark = str(ex)
        
        # before return the message, save the task status into db
        save_task_status(self.request.id, status, remark)
        return {"status":status, "remark":remark}
    

# if not problem, then insert the task_id and status to TmpRegisterStatus
def save_task_status(task_id, status, remark):
    tmpRegsSerializer = TmpRegisterStatusSerializer(data={"task_id":task_id, "status":status, "remark":remark})
    if tmpRegsSerializer.is_valid():
        tmpRegsSerializer.save()
    
    