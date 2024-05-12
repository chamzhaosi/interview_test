"""
ASGI config for backend_test project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_test.settings')

# Django setup
django.setup()

# Import your channels routing after Django setup to avoid premature loading
from realtime.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Django's ASGI application for handling HTTP requests
    "websocket": AuthMiddlewareStack(  # Channels layer for handling WebSocket connections
        URLRouter(
            websocket_urlpatterns
        )
    ),
})

