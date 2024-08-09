from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth import login

from .models import User, UserFollowing
from Posts.models import Posts


class Users_services:   

    def Check_user_exist_and_login(self, username, password):

            user = User.objects.get(username=username, password=password)
            if user:
                login(self, user)
                return redirect('/profile')
            else:
                return JsonResponse({'response': 404, 'message': 'Такой пользователь не найден'})


    def get_user_profile_data(self):
        user_subscribers = UserFollowing.objects.filter(following_user=self.user)
        user_subscribes = UserFollowing.objects.filter(user_id=self.user)
        postWithoutVideo = Posts.objects.filter(author=self.user)
        AllPostedPublication = postWithoutVideo
        
        return {
            'user': self.user,
            'subscribes': len(user_subscribes),
            'subscribers': len(user_subscribers),
            'posts': postWithoutVideo

        }

    def change_user_data(self, requestFiles):
        new_data_for_user = self.POST
        user = User.objects.get(id=self.user.id)
        for data in new_data_for_user:
            user.__dict__[data] = new_data_for_user[data]

        if requestFiles:
            user.avatar = self.FILES['avatar']
            print('a=========================================')
        user.save()

        return redirect('/')


    def get_another_user_profile(self, user):
        user_subscribers = UserFollowing.objects.filter(following_user=user)
        user_subscribes = UserFollowing.objects.filter(user_id=user.id)

        return {
            'user': user,
            'subscribes': len(user_subscribes),
            'subscribers': len(user_subscribers),
            'posts': Posts.objects.filter(author=user).order_by('-created')
        }
    
    def subscribe_user(self, user_id):
        subscribed_to_user = User.objects.get(id=user_id)
        if UserFollowing.objects.filter(user_id=self.user, following_user=subscribed_to_user):
            return JsonResponse('вы уже подписались на этого пользователя!', safe=False)
        else:
            newFollowingUser = UserFollowing(
                user_id=self.user,
                following_user=subscribed_to_user,
            )
            newFollowingUser.save()

    def unsubscribe_user(self, following_user_id):
        UserFollowing.unsubscribe(self, following_user_id)
        return JsonResponse({'status_code':200})

    def get_user_subscribes_data(self):
        UserFollowing.objects.filter(user_id=self.user)
