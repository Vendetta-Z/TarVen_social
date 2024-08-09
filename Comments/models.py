from django.conf import settings
from django.db import models
from Posts.models import Posts


class CustomDateTimeField(models.DateTimeField):
    def value_to_string(self, obj) -> str:
        val = super().value_to_string(obj)
        if val:
            val.replace(microsecond=0)
            return val.isoformat()
        return ''

class Comments(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)
    text = models.CharField(max_length=500)
    created = CustomDateTimeField(auto_now_add=True)

    class META:
        fields = ['author', 'post', 'text', 'created']
