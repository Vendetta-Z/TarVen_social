from django.urls import path

from Users.views import User_views

urlpatterns = [
    path("<int:id>", User_views.get_user_profile),
    path("change_user_data", User_views.change_user_data),
]
