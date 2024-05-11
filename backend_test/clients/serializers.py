from rest_framework import serializers
from .models import ClientsAccount, TmpRegisterStatus
from django.contrib.auth.hashers import make_password
import re, time

from phonenumber_field.serializerfields import PhoneNumberField

# Serializer for user registration
class ClientRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsAccount
        fields = ['username', 'password', 'c_name', 'role', 'email', 'phone_number']
        
        extra_kwargs = {
            "password" : {"write_only": True},
        }
    
    def validate(self, data):
        # username
        if len(data['username']) < 5 or data['username'][0:1].isdigit():
            raise serializers.ValidationError({"username":"Username must more than 5 characters and start with alphabet"})

        # password
        self.isInvalidPassword(data['password'])

        # name
        if len(data['c_name']) < 5 or re.findall('[0-9]', data['c_name']):
            raise serializers.ValidationError({"c_name":"Name must more than 5 characters and cannot contain any digit."})

        # phone number
        phone_number = PhoneNumberField()
        
        # role
        if "role" in data and data['role'].upper() != "USER" and data['role'].upper() != "ADMIN":
            raise serializers.ValidationError({"role":"Only USER or ADMIN can be setted."})
        
        return data
    
    def isInvalidPassword(self, password):
        if len(password) < 5:
            raise serializers.ValidationError({"password":"Password must more than 5 characters"})
        if not re.findall('[A-Z]', password):  # Checks for uppercase letters
            raise serializers.ValidationError({"password":"The password must contain at least one uppercase letter."})
        if not re.findall('[0-9]', password):  # Checks for digits
            raise serializers.ValidationError({"password":"The password must contain at least one digit."})
        if not re.findall('[^A-Za-z0-9]', password):  # Checks for special characters
            raise serializers.ValidationError({"password":"The password must contain at least one special character."})
    
    def create(self, validated_data):
        user = ClientsAccount.objects.create(
            username=validated_data['username'],
            c_name=validated_data['c_name'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=make_password(validated_data['password']),
            role=validated_data['role'].upper(),
        )
        user.save()
        return user

# Serializer for displaying user profile information
class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsAccount
        fields = ['id', 'username', 'c_name', 'email', 'phone_number', 'active', 'update_on', 'create_on']
      
# Serializer for displaying user profile information
class ClientDeactivedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsAccount  
        fields = ['active']
    
class TmpRegisterStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TmpRegisterStatus
        fields = ['task_id', 'status', 'remark']