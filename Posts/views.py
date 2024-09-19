from django.shortcuts import render
from django.http import JsonResponse

from .services import Posts_services

class Posts_views:

    def save_post_view(self):
        post_id = self.POST.get('saved_post_id')
        return Posts_services.savePostToFavorite(self, post_id)

    def show_saved_views(self):
        saved_posts = Posts_services.getUserSavedPosts(self)
        return render(self, 'Favorites.html', { 'saved_posts': saved_posts})

    def get_user_posts(self):
        author_id = self.GET.get('post_author')
        posts = Posts_services.getUserPosts(self, author_id)
        return JsonResponse(posts, safe=False)

    def get_post(self):
        post_id = self.GET.get('post_id')
        post_data = Posts_services.getPostData(self, post_id=post_id)


    def create_post(self):
        postFileInRequest= self.FILES['postFile']
        postPreview= self.POST['postPreview']
        postDescription = self.POST.get('postDescription')
        postTitle = self.POST.get('postDescription')
        Post = Posts_services.createNewPost(self, postFileInRequest, postDescription, postTitle, postPreview)
        return JsonResponse(Post, safe=False)

    def change_post_data(self):
        request_POST = self.POST
        request_FILES = ''
        if self.FILES:
            request_FILES = self.FILES['post_image']

        return Posts_services.changePostData(request_POST, request_FILES)

    def delete_post(self):
        post_id = self.POST['postId']
        Posts_services.deletePost(self, post_id)
        return JsonResponse('post succesfull deleted!', safe=False)    