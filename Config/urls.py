
from django.contrib import admin
from django.urls import path
from django.conf import settings

from Posts.views import Posts_views
from Users.views import User_views
from Likes.views import LikeViews
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', User_views.profile),

    path('login/', User_views.login_page, name="login_page"),
    path('register/', User_views.register_page, name="register_page"),
    path('logout/', User_views.logout, name="logout"),
    path('<int:id>', User_views.get_user_profile),
    path('change_user_data', User_views.change_user_data),
    path('publication_feed', User_views.publication_feed),
    # path('publish_video', User_views.publish_video), Не понятно что я хотел сделать, но после реструктуризации проекта , в случае ненадобности данной строки удалить с корнями
    path('subscribe', User_views.subscribe, name='subscibe_to'),
    path('user_subscribes', User_views.get_user_subscribes, name='user_subscribes'),
    path('unsubscribe', User_views.unsubscribe, name='unsubscribe'),


    path('get_post', Posts_views.get_post, name='get_post'),
    path('Post/save_post', Posts_views.save_post_view, name='save_post'),
    path('Post/show_saved_posts', Posts_views.show_saved_views),
    path('get_user_posts', Posts_views.get_user_posts, name='get_all_user_posts'),
    path('change_post_data', Posts_views.change_post_data, name='change_post_data'),
    path('create_new_post/', Posts_views.create_post, name='create_post'),
    path('delete_post', Posts_views.delete_post, name='delete post'),

    path('Like/add_like', LikeViews.add_like, name='Add like')
]
