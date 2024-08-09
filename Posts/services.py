from django.http import JsonResponse
from django.core import serializers

from .models import Posts, Saved_post

from Likes.models import Like

from Comments.models import Comments
from Comments.serializers import CommentsSchema

from Users.models import UserFollowing


class Posts_services:

    def get_post_data(self, post_id):
        post = Posts.objects.get(id=post_id)
        post_likes_len = len(Like.objects.filter(product=post))

        like_icon = "/static/image/likeHearthicon.png"
        if Like.check_user_liked(self, user=self.user, post=post):
            like_icon = "/static/image/likeHearthicon_after.png"

        post_comments = Comments.objects.filter(post=post).order_by('-created')
        schema = CommentsSchema(many=True)
        json_post_comments = schema.dump(post_comments)


        self_user_follow_author = 0
        follow = UserFollowing.objects.filter(user_id=self.user, following_user=post.author.id)
        if len(follow) > 0:
            self_user_follow_author = 1

        return {
            'post': serializers.serialize('json', [post]),
            'author': serializers.serialize('json', [post.author]),
            'Likes':post_likes_len,
            'like_icon': like_icon,
            'comments': json_post_comments,
            'self_user_follow_author': self_user_follow_author
        }

    def save_post_to_favorite(self, post_id):
        post = Posts.objects.get(id=post_id)

        if Saved_post.objects.filter(save_post = post).exists():
            Saved_post.objects.get(user_saved_post = self.user, save_post = post).delete()
            return JsonResponse({'post_status': 'removed'}, safe=False)
        else:
            Save_post = Saved_post(
                user_saved_post = self.user,
                save_post = post
                )
            Save_post.save()
            return JsonResponse({'post_status': 'saved'}, safe=False)

    def get_user_saved_posts(self):
        
        return Saved_post.objects.filter(user_saved_post=self.user)

    def get_user_posts(self, post_autor):
        post_list = Posts.objects.filter(author= post_autor)
        return serializers.serialize('json', post_list)

    def create_new_post(self, postImage, postDescription):
        Post = Posts(
            author=self.user,
            PostVidOrImg=postImage,
            description=postDescription
            )
        Post.save()

        return serializers.serialize('json', [Post])

    def change_post_data(Request_POST, request_FILES):
        post_by_id = Posts.objects.get(id=Request_POST['id'])
        if request_FILES:
            post_by_id.PostVidOrImg = request_FILES
        post_by_id.description = Request_POST['post_description']
        post_by_id.save()
        return JsonResponse('200' , safe=False)

    def delete_post(self, post_id):
        Posts.objects.filter(author=self.user, id=post_id).delete()