from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

import json

from .models import Message, Chat, Reply, HiddenMessage
from Users.models import User


@database_sync_to_async
def create_message(user, chatId, text):
    chat = Chat.objects.get(id=chatId)
    # Создаем и сохраняем сообщение, затем возвращаем сам объект
    return Message.objects.create(sender=user, chat=chat, text=text)

@database_sync_to_async
def get_user(userId):
    return User.objects.get(id=userId)

@database_sync_to_async
def createReply(user, replyingTo, text):
    message = Message.objects.get(id=replyingTo)
    return Reply.objects.create(author=user, replyingTo=message, text=text)

@database_sync_to_async
def get_message_by_id(message_id):
    # Извлекаем сообщение по его идентификатору
    return Message.objects.get(id=message_id)

@database_sync_to_async
def delete_message(message_id):
    Message.objects.get(id=message_id).delete()
    return 200

@database_sync_to_async
def hide_message_for_user(userId, messageId):
    user = User.objects.get(id=userId)
    message = Message.objects.get(id=messageId)
    HiddenMessage.objects.create(user = user, message = message)


#TODO доделать логику конвертирования ответов в обычные сообщения , в случае удаления сообщения на которые они ссылаются
# @database_sync_to_async
# def convert_all_replies_to_messages(chatId, message_id):
    
#     message = get_message_by_id(message_id)
#     replies = Reply.objects.filter(replyingTo=message)
#     for reply in replies:
#         Message.objects.create(chat=chatId, sender=reply.author, text=reply.text, created=reply.created).save()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.roomGroupName = "group_chat_gfg"
        await self.channel_layer.group_add(self.roomGroupName, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.roomGroupName, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type", "message")  # Получаем тип сообщения, если его нет, используем "message"
        match  message_type:
            case 'ReplyMessage':
                await self.handle_reply_message(text_data_json)
            case 'DeleteMessageFromAll':
                await self.DeleteMessageFromAll(text_data_json)
            case 'DeleteMessageFromUser':
                await self.DeleteMessageFromUser(text_data_json)
            case _:
                await self.handle_message(text_data_json)
            
    async def handle_message(self, text_data_json):
        # Обрабатываем обычное сообщение
        text = text_data_json["message"]
        userID = text_data_json["userID"]
        chatID = text_data_json["chatID"]
        user = await get_user(userID)
        message = await create_message(user=user, chatId=chatID, text=text)

        await self.channel_layer.group_send(
            self.roomGroupName,
            {
                "type": "sendMessage",
                "message": text,
                "messageId":message.id,
                "username": user.username,
                "created": message.created.strftime("%Y-%m-%d %H:%M:%S"),  # Форматируем время
            },
        )

    async def handle_reply_message(self, text_data_json):
        replying_to = text_data_json["replyingTo"]
        message_text = text_data_json["messageText"]
        userID = text_data_json["userID"]

        user = await get_user(userID)
        reply = await createReply(user=user, replyingTo=replying_to, text=message_text)
        replying_to_message_text = await get_message_by_id(replying_to)

        await self.channel_layer.group_send(
            self.roomGroupName,
            {
                "type": "sendMessage",
                "replying_to":replying_to_message_text.text,
                "replying_to_id":reply.id,
                "messageText": message_text,
                "username": user.username,
                "created": reply.created.strftime("%Y-%m-%d %H:%M:%S"),  # Форматируем время
                "IsReply":True
            },
        )

    async def sendMessage(self, event):
        is_reply = event.get("IsReply", False)
        username = event["username"]
        created = event["created"] 
        if is_reply:
            # Отправляем ответ на сообщение и время его создания клиенту

            replying_to = event["replying_to"]
            replying_to_id = event["replying_to_id"]
            messageText = event["messageText"]
            await self.send(
                text_data=json.dumps({
                    "replying_to":replying_to,
                    "replying_to_id":replying_to_id,
                    "messageText": messageText,
                    "username": username,
                    "created": created,
                    "IsReply":True
                })
            )
        else:
            # Отправляем сообщение и время его создания клиенту
            messageId = event['messageId']
            message = event["message"]
            await self.send(
                text_data=json.dumps({
                    "message": message,
                    "messageId": messageId,
                    "username": username,
                    "created": created
                })
            )

    async def DeleteMessageFromAll(self, event):
        messageId = event['messageId']
        await delete_message(messageId)
        
        await self.channel_layer.group_send(
            self.roomGroupName,
            {
                "type": "message_deleted",
                "messageId":messageId,
            },
        )

    async def DeleteMessageFromUser(self, event):
        messageId = event['messageId']
        userId = event['userId']
        await hide_message_for_user(userId = userId, messageId =messageId)
        await self.send(
                text_data=json.dumps({
                    "messageId": messageId,
                    "IsHidden":True
                })
            )

    # Обработчик для удаления сообщения из группового чата
    async def message_deleted(self, event):
        messageId = event["messageId"]
        await self.send(text_data=json.dumps({
            "type": "message_deleted",
            "messageId": messageId,
            "isDeleteFromAll": True 
        }))