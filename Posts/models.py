import os.path

from django.conf import settings
from django.db import models
from django.core.validators import FileExtensionValidator

from typing import Any
import cv2


def getUploadFileUrl(instance, filename):
    fileType = Posts.CheckTypeOfFile(filename)
    upload_dir = f'Config/static/PostData/{instance.author.id}/{fileType}/'

    if not os.path.isdir(upload_dir):
        os.makedirs(upload_dir)

    return os.path.join(upload_dir, filename)



class Posts(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.CharField(max_length=350)
    created = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=350)

    imageTypesForPost = ['jpeg','jpg', 'png']
    videoTypesForPost = ['mp3', 'mp4']
    allTypesForPost = str(imageTypesForPost + videoTypesForPost)
    PostFile = models.FileField(upload_to=getUploadFileUrl,
                                validators=[FileExtensionValidator(allowed_extensions=[allTypesForPost])])
    preview = models.ImageField(upload_to=getUploadFileUrl)
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)


    @staticmethod
    def CheckTypeOfFile(filename):
        # Получаем расширение файла
        extension = filename.split('.')[-1].lower()
        # Определяем тип файла по расширению
        if extension in ['mp3', 'mp4']:
            return 'video'
        elif extension in ['jpeg', 'jpg', 'png']:
            return 'image'
        else:
            return 'unknown'


class Saved_post(models.Model):
    user_saved_post = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    save_post = models.OneToOneField(Posts, unique=True,on_delete=models.CASCADE)
    saved_time = models.DateTimeField(auto_now=True)


    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

