from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.hashers import make_password
from .models import ClientsAccount

# Assuming your custom user model is referenced in settings.AUTH_USER_MODEL
@receiver(post_migrate)
def create_default_user(sender, **kwargs):
    username = "admin"  # The default username you want to check for

    # Check if a user with this username exists
    if not ClientsAccount.objects.filter(username=username).exists():
        ClientsAccount.objects.create(
            username=username,
            email="admin@gmail.com",
            password=make_password("Admin@123"), 
            phone_number="+60123456789",
            fullname="admin",
            role="ADMIN"
        )
