import os

from django.conf import settings
from django.db import models

from typing import Any
from Users.models import User


def getUploadFileUrl(instance, filename):
    uploadDir = settings.MMEDIA_ROOT + f"/{instance.author.id}/"
    if not os.path.isdir(uploadDir):
        os.makedirs(uploadDir)

    return os.path.join(uploadDir, filename)


class Music(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to=getUploadFileUrl)
    author = models.ForeignKey(User, unique=False, on_delete=models.CASCADE)
    PublishedDay = models.DateTimeField(auto_now=True)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
