from .models import Comments
from .services import comments_services


class CommentsViews:

    def new_comment(self):
        post_id = self.POST.get('post_id')
        comm_text = self.POST.get('comm_text')
        return comments_services.add_new_comment(self, post_id, comm_text)