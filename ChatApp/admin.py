from django.contrib import admin
from .models import Chat, Message, Reply, HiddenMessage

admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(Reply)
admin.site.register(HiddenMessage)