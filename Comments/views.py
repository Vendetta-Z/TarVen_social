from .models import Comments
from .services import comments_services
from Posts.models import Posts

class CommentsViews:

    def new_comment(self):
        post_id = self.POST.get('post_id')
        comm_text = self.POST.get('comm_text')
        return comments_services.add_new_comment(self, post_id, comm_text)
    
    # def getComments(self):
    #     post_id = self.GET.get('post_id')
        
    #     # comments = Comments.objects.filter(post = post)
    #     comments = comments_services.getComments(post_id)
    #     return comments