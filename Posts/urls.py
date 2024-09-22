from django.urls import path
from .views import Posts_views


urlpatterns = [
    path('search', Posts_views.Search, name='search'),
    path("get_post", Posts_views.get_post, name="get_post"),
    path("save_post", Posts_views.save_post_view, name="save_post"),
    path("show_saved_posts", Posts_views.show_saved_views),
    path("get_user_posts", Posts_views.get_user_posts, name="get_all_user_posts"),
    path("change_post_data", Posts_views.change_post_data, name="change_post_data"),
    path("create_new_post/", Posts_views.create_post, name="create_post"),
    path("delete_post", Posts_views.delete_post, name="delete post"),
]
