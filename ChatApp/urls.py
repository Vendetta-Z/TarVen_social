from django.urls import path, include
from .views import ChatViews


urlpatterns = [
    path("Chats", ChatViews.Chats, name="chats page"),
    path("Chat/<int:user_id>", ChatViews.startChat, name="chat-page"),
    path("remove", ChatViews.Remove, name="chat-page"),
    path("chat_room/<int:chat_id>/", ChatViews.chat_room, name="chat_room"),
]
