from django.db import models
from django.contrib.auth.models import AbstractUser, User

from typing import Any


class User(AbstractUser):
    status = models.CharField(max_length=120, default='Hi i\'m use a TarVin', null=False)
    avatar = models.ImageField(default='Config/image/default_avatar.png', upload_to='Config/static/PostData')
    
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
    

class UserFollowing(models.Model):
    
    user_id = models.ForeignKey(User , on_delete=models.CASCADE, related_name='subscribe_to')
    following_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscribed')

    def unsubscribe(self, following_user_id):
        user_subscribe = UserFollowing.objects.filter(user_id = self.user ,following_user_id=following_user_id)
        user_subscribe.delete()
