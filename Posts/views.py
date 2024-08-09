from django.shortcuts import render
from django.http import JsonResponse

from Config.settings import SECRET_KEY
from .services import Posts_services

class Posts_views:

            
    def save_post_view(self):
        post_id = self.POST.get('saved_post_id')
        return Posts_services.save_post_to_favorite(self, post_id)

    def show_saved_views(self):
        saved_posts = Posts_services.get_user_saved_posts(self)
        return render(self, 'favorite_saved_post.html', { 'saved_posts': saved_posts})

    def get_user_posts(self):
        author_id = self.GET.get('post_author')
        posts = Posts_services.get_user_posts(self, author_id)
        return JsonResponse(posts, safe=False)

    def get_post(self):
        post_id = self.GET.get('post_id')
        post_data = Posts_services.get_post_data(self, post_id=post_id)

        return JsonResponse(
            post_data,
            safe=False
        )

    def create_post(self):
        postImage = self.FILES['postImage']
        postDescription = self.POST.get('postDescription')
        Post = Posts_services.create_new_post(self, postImage, postDescription)
        return JsonResponse(Post, safe=False)

    def change_post_data(self):
        request_POST = self.POST
        request_FILES = ''
        if self.FILES:
            request_FILES = self.FILES['post_image']

        return Posts_services.change_post_data(request_POST, request_FILES)

    def delete_post(self):
        post_id = self.POST['post_id']
        Posts_services.delete_post(self, post_id)
        return JsonResponse('post succesfull deleted!', safe=False)    

    # def publish_video(self):
    #     return render(self, 'publish_video.html')