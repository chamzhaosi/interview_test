from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from .models import ClientsAccount
from .tasks import create_user_task

from .serializers import ClientRegistrationSerializer, ClientProfileSerializer

# Create your views here.
@api_view(["POST"])
def register(request):
    task = create_user_task.delay(request.data)
    return Response({"Message": "User creation in progress."}) 