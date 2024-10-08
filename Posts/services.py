from django.http import JsonResponse
from django.core import serializers

from .models import Posts, Saved_post

from Likes.models import Like

from Comments.models import Comments
from Comments.serializers import CommentsSchema

from Users.models import User, UserFollowing


class Posts_services:

    def getPostData(self, post_id):
        post = Posts.objects.get(id=post_id)
        post_likes_len = len(Like.objects.filter(product=post))
        post_comments = Comments.objects.filter(post=post).order_by("-created")
        isSaved = 0
        if Saved_post.objects.filter(user=self.user, post=post).exists():
            isSaved = 1

        like_icon = "Config/static/icons/heart.png"
        if Like.check_user_liked(self, user=self.user, post=post):
            like_icon = "Config/static/icons/red_heart.png"

        schema = CommentsSchema(many=True)
        json_post_comments = schema.dump(post_comments)

        self_user_follow_author = 0
        follow = UserFollowing.objects.filter(
            user_id=self.user, following_user=post.author.id
        )
        if len(follow) > 0:
            self_user_follow_author = 1

        return {
            "post": serializers.serialize("json", [post]),
            "author": serializers.serialize("json", [post.author]),
            "Likes": post_likes_len,
            "like_icon": like_icon,
            "comments": json_post_comments,
            "self_user_follow_author": self_user_follow_author,
            "isSaved": isSaved,
        }

    def savePostToFavorite(self, post_id):
        post = Posts.objects.get(id=post_id)
        if Saved_post.objects.filter(post=post).exists():
            Saved_post.objects.get(user=self.user, post=post).delete()
            return JsonResponse({"post_status": "removed"}, safe=False)
        else:

            save_post = Saved_post(user=self.user, post=post)
            save_post.save()
            return JsonResponse({"post_status": "saved"}, safe=False)

    def getUserSavedPosts(self):

        return Saved_post.objects.filter(user=self.user)

    def getUserPosts(self, post_autor):
        post_list = Posts.objects.filter(author=post_autor)
        return serializers.serialize("json", post_list)

    def createNewPost(self, postFile, postDescription, postTitle, postPreview):
        Post = Posts(
            author=self.user,
            PostFile=postFile,
            description=postDescription,
            title=postTitle,
            preview=postPreview,
        )
        Post.save()

        return serializers.serialize("json", [Post])

    def changePostData(Request_POST, request_FILES):
        post_by_id = Posts.objects.get(id=Request_POST["id"])
        if request_FILES:
            post_by_id.PostFile = request_FILES
        post_by_id.description = Request_POST["post_description"]
        post_by_id.save()
        return JsonResponse("200", safe=False)

    def deletePost(self, post_id):
        Posts.objects.filter(author=self.user, id=post_id).delete()

    def search(self, searchParams):
        PostsResult = Posts.objects.filter(title__icontains= searchParams)
        UsersResult = User.objects.filter(username__icontains = searchParams)
        PostsResultJson = serializers.serialize('json', PostsResult)
        UsersResultJson = serializers.serialize('json', UsersResult)
        searchResultData = {
            'Posts':PostsResultJson,
            'Users':UsersResultJson
        }
        
        return JsonResponse({'result': searchResultData}, safe=False)
        
    