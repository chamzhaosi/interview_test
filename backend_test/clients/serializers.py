from rest_framework import serializers
from .models import ClientsAccount, TmpRegisterStatus
from django.contrib.auth.hashers import make_password
import re, time

from phonenumber_field.serializerfields import PhoneNumberField

# Serializer for user registration
class ClientRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsAccount
        fields = ['username', 'password', 'fullname', 'role', 'email', 'phone_number']
        
        extra_kwargs = {
            "password" : {"write_only": True},
        }
    
    def validate(self, data):
        # username
        if len(data['username']) < 5 or data['username'][0:1].isdigit() or re.search(r"\s", data['username']):
            raise serializers.ValidationError({"username":"Username must be more than 5 characters long and start with a letter, without any spaces."})

        # password
        # create 
        if (not self.instance and 'password' in data) or (self.instance and 'password' in data):
            self.isInvalidPassword(data['password'])

        # name
        if len(data['fullname']) < 5 or re.findall('[0-9]', data['fullname']):
            raise serializers.ValidationError({"fullname":"Fullname must more than 5 characters and cannot contain any digit."})

        # phone number
        # phone_number = PhoneNumberField() ## only can check +60<9 digits>, for +60<10 digits> will wrong
        if "phone_number" in data:
            pattern = re.compile(r"\+601[0-9]{8,9}$")
            if not bool(pattern.match(data['phone_number'])):
                raise serializers.ValidationError({"phone number":"Phone number must start with +60 followed by 9 to 10 digits only."})
            
        # role
        if "role" in data and data['role'].upper() != "USER" and data['role'].upper() != "ADMIN":
            raise serializers.ValidationError({"role":"Only USER or ADMIN can be setted."})
        
        return data
    
    def isInvalidPassword(self, password):
        if len(password) < 5:
            raise serializers.ValidationError({"password":"Password must more than 5 characters."})
        if not re.findall('[A-Z]', password):  # Checks for uppercase letters
            raise serializers.ValidationError({"password":"The password must contain at least one uppercase letter."})
        if not re.findall('[0-9]', password):  # Checks for digits
            raise serializers.ValidationError({"password":"The password must contain at least one digit."})
        if not re.findall('[^A-Za-z0-9]', password):  # Checks for special characters
            raise serializers.ValidationError({"password":"The password must contain at least one special character."})
    
    def update(self, instance, validated_data):
        if "password" in validated_data:
            password = validated_data.pop('password')
            instance.password = make_password(password)
            
        # Update other fields as usual
        instance.username = validated_data.get('username', instance.username)
        instance.fullname = validated_data.get('fullname', instance.fullname)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
            
        instance.save()
        return instance
        
    def create(self, validated_data):
        user = ClientsAccount.objects.create(
            username=validated_data['username'],
            fullname=validated_data['fullname'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=make_password(validated_data['password']),
        )
        user.save()
        return user
    
# Ipdate client basic data
class ClientBasicDataSerializer(ClientRegistrationSerializer, serializers.ModelSerializer):
    class Meta:
        model = ClientsAccount
        fields = ['username', 'fullname', 'email', 'phone_number']

# Serializer for displaying user profile information
class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsAccount
        fields = ['id', 'username', 'fullname', 'email', 'phone_number', 'active', 'update_on', 'create_on']
      
# Serializer for displaying user profile information
class ClientDeactivedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsAccount  
        fields = ['active']
    
class TmpRegisterStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TmpRegisterStatus
        fields = ['task_id', 'status', 'remark']