from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.hashers import check_password
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import ClientRegistrationSerializer, ClientProfileSerializer, ClientDeactivedSerializer
from .models import ClientsAccount
from .tasks import create_user_task
import json, datetime, jwt

# Create your views here.
@api_view(["POST"])
def register(request):
    ## celery concurrecy handling
    task = create_user_task.delay(request.data)
    return Response({"Message": "User creation in progress.", "task_id":task.id}) 


@api_view(["GET"])
def login(request):
    response = Response()
    
    username = request.data.get('username', default=None)
    password = request.data.get('password', default=None)
    
    try:
        client = ClientsAccount.objects.get(username=username)
        
        # if the client still active
        if client.active:
            if check_password(password, client.password):
        
                # create token
                payload = {
                    "id": client.id,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
                    "iat": datetime.datetime.utcnow(),
                }
                token = jwt.encode(payload, "MetroPolice", algorithm="HS256")
                
                response.data = {"success": "Login successfully!"}
                response.set_cookie(key="jwt", value=token, httponly=True)
                response.status_code = 200
                
            else:  # Password is incorrect
                response.data = {"error": "Unauthenticated!"}
                response.status_code = 401
                    
        # if not active
        else:
            response.data = {"error": "User account is not available!"}
            response.status_code = 401           
       
       
    # if the user not found     
    except Exception as ex:
        print(ex)
        response.data = {"error": "Account Not Exist!"}
        response.status_code = 404
        
    return response
    
@api_view(["GET"])
def read_dashboard_data(request):
    response = Response()

    try:
        token = request.COOKIES.get("jwt")
        payload = jwt.decode(token, "MetroPolice", algorithms=["HS256"])
        client = ClientsAccount.objects.get(id=payload["id"])

        if client.active:
            if client.role == "USER":
                response.data = {
                    "client_info": {
                        # "id": user.id,
                        "username": client.username,
                        "name" : client.fullname,
                        "email": client.email,
                        "phone_number": str(client.phone_number),
                        "role" : client.role,
                        "update_on": client.update_on,
                        "create_on": client.create_on,
                    }
                }
                response.status_code = 200
                
            # if Admin    
            else:   
                clients = ClientsAccount.objects.all()
                paginator = PageNumberPagination()
                paginator.page_size = 10

                result_page = paginator.paginate_queryset(clients, request)
                serializer = ClientProfileSerializer(result_page, many=True)
                return paginator.get_paginated_response(serializer.data)
        else:
            response.data = {"error": "User account is not available!"}
            response.status_code = 401

    except jwt.ExpiredSignatureError:
        response.data = {"error": "Unauthenticated!"}
        response.status_code = 401

    except jwt.exceptions.DecodeError:
        response.data = {"error": "Not token found!"}
        response.status_code = 404

    return response


@api_view(['PUT'])
def update_user_detail(request):
    response = Response()

    try:
        token = request.COOKIES.get("jwt")
        payload = jwt.decode(token, "MetroPolice", algorithms=["HS256"])
        client = ClientsAccount.objects.get(id=payload["id"])

        if client.active:
            serializer = ClientRegistrationSerializer(client, data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # update existing data
            serializer.save()
            response.data = {"success": "User account has been updated"}
            response.status_code = 200     
            
        else:
            response.data = {"error": "User account is not available!"}
            response.status_code = 401      
            
    except jwt.ExpiredSignatureError:
        response.data = {"error": "Unauthenticated!"}
        response.status_code = 401

    except jwt.exceptions.DecodeError:
        response.data = {"error": "Not token found!"}
        response.status_code = 404

    return response
    
    
@api_view(['PUT'])
def update_user_detail(request, id):
    response = Response()

    try:
        token = request.COOKIES.get("jwt")
        payload = jwt.decode(token, "MetroPolice", algorithms=["HS256"])
        client = ClientsAccount.objects.get(id=payload["id"]) # who process the task

        if client.role == "ADMIN" and client.active:
            t_client = ClientsAccount.objects.get(id=id) # which client want to be deactived
            serializer = ClientDeactivedSerializer(t_client, data=request.data)
            
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            status = "actived" if serializer.data['active']  else "deactived" 
            response.data = {"success": f"{t_client.username } has been {status}!"}
            response.status_code = 200  
            
        else:
            response.data = {"error": "User no premission to do so or User account is not available!"}
            response.status_code = 401
                       
            
    except jwt.ExpiredSignatureError:
        response.data = {"error": "Unauthenticated!"}
        response.status_code = 401

    except jwt.exceptions.DecodeError:
        response.data = {"error": "Not token found!"}
        response.status_code = 404

    return response
    
    
@api_view(['POST'])
def logout(request):
    response = Response()

    response.delete_cookie('jwt')
    response.data = {
        'success' : 'jwt has been deleted'
    }
    # response.status_code = 200
    return response
