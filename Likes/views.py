from django.http import JsonResponse
from .models import Like

from Posts.models import Posts


class LikeViews:

    def add_like(self):
        post = Posts.objects.get(id=self.POST.get('post_id'))
        if Like.check_user_liked(self, user=self.user, post=post):
            LikeViews.remove_like(self, post=post)
            return JsonResponse({
                'status_code': 200,
                'message':'successful removed like',
                'method': 'R',
                'Likes_count':Like.objects.filter(product=post).count(),
                'like_icon': "Config\static\icons\heart.png"})
        like = Like()
        like.author = self.user
        like.product = post
        like.save()        

        return JsonResponse({
            'status_code': 200,
            'message':'successful liked',
            'method':'A',
            'Likes_count':Like.objects.filter(product=post).count(),
            'like_icon': "Config\static\icons\\red_heart.png"})


    def remove_like(self, post):
        try:
            Like.objects.get(author=self.user, product=post).delete()
        except Exception as E:
            return E
