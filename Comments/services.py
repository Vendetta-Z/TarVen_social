from django.http import JsonResponse
from Posts.models import Posts

from Comments.models import Comments

class comments_services:
    
    def add_new_comment(self, post_id, comm_text):
        post = Posts.objects.get(id=post_id)
        comm = Comments( author=self.user, post=post, text=comm_text)
        comm.save()
        return JsonResponse({
            'status_code': 200,
            'author': comm.author.first_name,
            'text': comm.text,
            'created': comm.created
        })
    

    # def getComments(post_id):
    #     avatars = []
    #     filteredComm = Comments.objects.filter(post = post_id)
    #     for comm in filteredComm:
    #         avatarFromCommAuthor = Comments.getAvatar(comm)

    #     return filteredComm, avatars