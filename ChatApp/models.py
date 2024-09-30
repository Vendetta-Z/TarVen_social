from django.db import models

from Users.models import User


class Chat(models.Model):
    user_1 = models.ForeignKey(
        User, related_name="chat_user_1", on_delete=models.CASCADE
    )
    user_2 = models.ForeignKey(
        User, related_name="chat_user_2", on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now=True)

    def __init__(self, *args: any, **kwargs: any) -> None:
        super().__init__(*args, **kwargs)


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __init__(self, *args: any, **kwargs: any) -> None:
        super().__init__(*args, **kwargs)


class Reply(models.Model):
    replyingTo = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='replies')
    text = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)  


class HiddenMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_for_hidden')
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='hidden_message_by_user')
