from attr.filters import include
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from Posts.views import Posts_views
from Users.views import User_views
from Likes.views import LikeViews
from Comments.views import CommentsViews
from Tmusic.urls import MusicViews


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", User_views.profile),
    path("login/", User_views.login_page, name="login_page"),
    path("register/", User_views.register_page, name="register_page"),
    path("logout/", User_views.logout, name="logout"),
    path("Music/", include("Tmusic.urls")),
    path("Posts/", include("Posts.urls")),
    path("User/", include("Users.urls")),
    path("Chat/", include("ChatApp.urls")),
    path("publication_feed", User_views.publication_feed),
    path("subscribe", User_views.subscribe, name="subscibe_to"),
    path("user_subscribes", User_views.getUserSubscribes, name="user_subscribes"),
    path("unsubscribe", User_views.unsubscribe, name="unsubscribe"),
    path("Comments/new_comment", CommentsViews.new_comment, name="add_comment"),
    path("Like/add_like", LikeViews.add_like, name="Add like"),
]
urlpatterns += static(settings.MMEDIA_URL, document_root=settings.MMEDIA_ROOT)
