"""
URL configuration for backend_test project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from clients import views as clients_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', clients_views.register),
    path('api/login/', clients_views.login),
    path('api/dashboard/', clients_views.read_dashboard_data),
    path('api/update_client/', clients_views.update_own_detail),
    path('api/update_clients/<int:id>/', clients_views.update_user_detail),
    path('api/logout/', clients_views.logout),
]
