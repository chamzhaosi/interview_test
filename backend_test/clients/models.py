from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.timezone import now

# Create your models here.
class ClientsAccount(models.Model):
    username = models.CharField(max_length=20, blank=False, null=False, unique=True)
    password = models.CharField(max_length=255, blank=False, null=False)
    c_name = models.CharField(max_length=50, blank=False, null=False)
    email = models.EmailField(max_length=50, blank=False, null=False, unique=True)
    phone_number = PhoneNumberField(max_length=50, blank=False, null=False)
    active = models.BooleanField(blank=False, null=False, default=True)
    role = models.CharField(max_length=10, blank=False, null=False, default="USER")
    update_on = models.DateTimeField(auto_now=True)
    create_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.username)
    
# To keep whether the user create success or not
class TmpRegisterStatus(models.Model):
    task_id = models.CharField(max_length=50, blank=False, null=False, unique=True)
    status = models.CharField(max_length=10, blank=False, null=False)
    remark = models.CharField(max_length=200, blank=False, null=False)
    
    def __str__(self):
        return str(self.task_id)
