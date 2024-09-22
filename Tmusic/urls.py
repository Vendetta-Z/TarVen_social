from django.urls import path

from Tmusic.views import MusicViews

urlpatterns = [
    path("create", MusicViews.create, name="create a music"),
    path("get", MusicViews.get, name="get music"),
    path("getAll", MusicViews.getAll, name="get all musics"),
    path("index", MusicViews.index, name="get all musics"),
    path("delete", MusicViews.delete, name="get all musics"),
]
