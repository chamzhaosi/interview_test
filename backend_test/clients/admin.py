from django.contrib import admin
from .models import ClientsAccount, TmpRegisterStatus

# Register your models here.
admin.site.register(ClientsAccount)
admin.site.register(TmpRegisterStatus)