from django.http import JsonResponse

from .models import Music
from django.core import serializers

class MusicServices:

    def create(file, author, title):
        music = Music(
            file = file,
            author = author,
            title = title
        )
        music.save()
        return {'music': serializers.serialize('json', [music])}

    def get(self, author, title):
        music = Music.objects.filter(author, title)
        return music

    def getAll(self, author):
        musics = Music.objects.filter(author=author)
        return musics

    def delete(self, id):
        Music.objects.get(author=self.user, id=id).delete()
        return JsonResponse({'statuc': '200'}, safe=False)