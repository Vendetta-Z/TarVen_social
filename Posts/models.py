from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator

from typing import Any
import cv2


class Posts(models.Model):
    imageTypesForPost = ['jpeg','jpg', 'png']
    videoTypesForPost = ['mp4']
    allTypesForPost = str(imageTypesForPost) + str(videoTypesForPost)
    #To do write a function to create and upload file on specified folder  
    getFileUploadURL = f'Config/static/PostData/'

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.CharField(max_length=350)
    created = models.DateTimeField(auto_now=True)
    preview = models.ImageField( blank=True,upload_to=getFileUploadURL, max_length=528)
    PostVidOrImg = models.FileField( upload_to=f'Config\static\PostData',
                                    validators=[FileExtensionValidator(allowed_extensions=['jpeg','jpg', 'png','mp4'])])

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        if self.PostVidOrImg:
            if self.PostVidOrImg.url[-3:] == 'mp4' and self.preview == '':
                PostVideo = cv2.VideoCapture((self.PostVidOrImg.url)[1:])
                img = PostVideo.read()[1]
                nameOfSavedPreview = (self.PostVidOrImg.url.split('.')[0] + 'PostPreview.jpg')[1:]
                cv2.imwrite(nameOfSavedPreview, img)
                self.preview = nameOfSavedPreview
                    
                
    def CheckTypeOfFile(self):
        fileType = ''
        filename = self.PostVidOrImg.name
        try:
            extension = filename.split('.')[-1]
            if extension == 'mp4':
                fileType = 'video'
            else:
                fileType = 'img'
        except Exception :
            fileType = 'incorrect'
        
        return fileType




class Saved_post(models.Model):
    user_saved_post = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    save_post = models.OneToOneField(Posts, unique=True,on_delete=models.CASCADE)
    saved_time = models.DateTimeField(auto_now=True)


    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

