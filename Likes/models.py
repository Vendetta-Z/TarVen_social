from django.conf import settings
from django.db import models

from Posts.models import Posts


class Like(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL , on_delete=models.CASCADE)
    product = models.OneToOneField(Posts, unique=True, on_delete=models.CASCADE)
    

    def check_user_liked(self, user, post):
        if Like.objects.filter(author=user, product=post).count() == 0: 
            return False
        
        return True  


    def get_likes_for_post(post):
        return Like.objects.filter(product=post).count()
