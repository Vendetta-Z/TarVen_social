from django.http import JsonResponse
from django.shortcuts import render, redirect

from itertools import chain
from operator import attrgetter

from Users.models import User
from .models import Chat, Message, Reply, HiddenMessage


class ChatViews:

    def startChat(request, user_id):
        user_1 = User.objects.get(id=request.user.id)
        user_2 = User.objects.get(id=user_id)
        chat, res = Chat.objects.get_or_create(user_1=user_1, user_2=user_2)
        return redirect("chat_room", chat_id=chat.pk)

    def chat_room(request, chat_id):
        chat = Chat.objects.get(id=chat_id)
        messages = Message.objects.filter(chat=chat)
        replies = Reply.objects.filter(replyingTo__chat =chat)
        hidden_messages = HiddenMessage.objects.filter(user=request.user).values_list('message_id', flat=True)

        for message in messages:
            if message.id in hidden_messages:
                message.text = "Сообщение удалено."


        combined_messages_and_replies = sorted(
            chain(messages, replies),
            key=attrgetter('created') if hasattr(Message, 'Created') else attrgetter('created')
        )

        return render(
            request, "chat/chat_room.html", {"chat": chat, "messages": combined_messages_and_replies }
        )

    def Chats(self):
        chats = Chat.objects.filter(user_2=self.user).union(
            Chat.objects.filter(user_1=self.user)
        )
        return render(self, "chat/Chats.html", {"Chats": chats})
    
    def Remove(self):
        chatIdInRequest = self.POST['chatId']
        try:
            Chat.objects.get(id=chatIdInRequest).delete()
            return JsonResponse({'status': 200})
        except Exception as e:
            return e