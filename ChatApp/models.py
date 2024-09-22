from tkinter.constants import CASCADE

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
    Created = models.DateTimeField(auto_now_add=True)

    def __init__(self, *args: any, **kwargs: any) -> None:
        super().__init__(*args, **kwargs)
