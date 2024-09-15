from django.http import JsonResponse
from django.shortcuts import render

from .models import Music
from .services import MusicServices
# Create your views here.
class MusicViews:

    def create(self):
        title = self.POST['Title']
        file = self.FILES['Audio']

        music = MusicServices.create(
            file=file,
            title=title,
            author=self.user
        )

        return JsonResponse(music, safe=False)



    def get(self):
        title = self.GET.get('title')
        music = MusicServices.get(self.user, title)
        return JsonResponse('music', music)

    def getAll(self):
        music = MusicServices.getAll(self, author=self.user)

        return render(self, 'Music.html', {'music': music})

    def delete(self):
        id = self.POST.get('musicId')
        return MusicServices.delete(self, id)

