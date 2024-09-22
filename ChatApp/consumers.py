from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

import json

from .models import Message, Chat
from Users.models import User


@database_sync_to_async
def create_message(user, chatId, text):
    chat = Chat.objects.get(id=chatId)
    # Создаем и сохраняем сообщение, затем возвращаем сам объект
    return Message.objects.create(sender=user, chat=chat, text=text)

@database_sync_to_async
def get_user(userId):
    return User.objects.get(id=userId)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.roomGroupName = "group_chat_gfg"
        await self.channel_layer.group_add(self.roomGroupName, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.roomGroupName, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text = text_data_json["message"]
        userID = text_data_json["userID"]
        chatID = text_data_json["chatID"]
        user = await get_user(userID)

        # Создаем сообщение и получаем его обратно
        message = await create_message(user=user, chatId=chatID, text=text)

        # Отправляем сообщение в группу вместе с его временем создания
        await self.channel_layer.group_send(
            self.roomGroupName,
            {
                "type": "sendMessage",
                "message": text,
                "username": user.username,
                "created": message.Created.strftime("%Y-%m-%d %H:%M:%S"),  # Форматируем время
            },
        )

    async def sendMessage(self, event):
        message = event["message"]
        username = event["username"]
        created = event["created"]  # Получаем время создания сообщения

        # Отправляем сообщение и время его создания клиенту
        await self.send(
            text_data=json.dumps({
                "message": message,
                "username": username,
                "created": created
            })
        )
