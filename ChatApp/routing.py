from django.urls import path, include, re_path
from ChatApp.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<chat_id>\d+)/$", ChatConsumer.as_asgi()),
]
