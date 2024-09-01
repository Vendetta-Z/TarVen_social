from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import login

from .models import User, UserFollowing
from Posts.models import Posts

class Users_services:   

    def CheckUserExistAndLogin(self, username, password):

            user = User.objects.get(username=username, password=password)
            if user:
                login(self, user)
                return redirect('/profile')
            else:
                return JsonResponse({'response': 404, 'message': 'Такой пользователь не найден'})

    def getUserProfileData(self):
        userSubscribers = UserFollowing.objects.filter(following_user=self.user)
        userSubscribes = UserFollowing.objects.filter(user_id=self.user)
        postWithoutVideo = Posts.objects.filter(author=self.user)
        
        return {
            'user': self.user,
            'subscribes': len(userSubscribes),
            'subscribers': len(userSubscribers),
            'posts': postWithoutVideo,
        }

    def changeUserData(self, requestFiles):
        newDataForUser = self.POST
        user = User.objects.get(id=self.user.id)
        for data in newDataForUser:
            user.__dict__[data] = newDataForUser[data]
        user.avatar = self.user.avatar

        if requestFiles:
            user.avatar = self.FILES['avatar']
            
        user.save()

        return redirect('/')

    def getAnotherUserProfile(self, user):
        userSubscribers = UserFollowing.objects.filter(following_user=user)
        userSubscribes = UserFollowing.objects.filter(user_id=user.id)

        return {
            'user': user,
            'subscribes': len(userSubscribes),
            'subscribers': len(userSubscribers),
            'posts': Posts.objects.filter(author=user).order_by('-created')
        }
    
    def subscribeUser(self, user_id):
        subscribedToUser = User.objects.get(id=user_id)
        if UserFollowing.objects.filter(user_id=self.user, following_user=subscribedToUser):
            return JsonResponse('200', safe=False)
        else:
            newFollowingUser = UserFollowing(
                user_id=self.user,
                following_user=subscribedToUser,
            )
            newFollowingUser.save()

    def unsubscribeUser(self, followingUserId):
        UserFollowing.unsubscribe(self, followingUserId)
        return JsonResponse({'status_code':200})

    def getUserSubscribesData(self):
        UserFollowing.objects.filter(user_id=self.user)
