from django.test import TestCase

from Comments.models import Comments
from Users.models import User
from Posts.models import Posts


class CommentsModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        user = User.objects.create(
            first_name="Test", last_name="test", status="test", password="test123123"
        )

        post = Posts.objects.create(
            author=user,
            description="test description",
            title="test",
        )

        Comments.objects.create(author=user, post=post, text="test")

    def testAuthorLabel(self):
        comment = Comments.objects.get(id=1)
        fieldLabel = comment._meta.get_field("author").verbose_name
        self.assertEqual(fieldLabel, "author")

    def testPostLabel(self):
        comment = Comments.objects.get(id=1)
        fieldLabel = comment._meta.get_field("post").verbose_name

        self.assertEqual(fieldLabel, "post")

    def testTextLabel(self):
        comment = Comments.objects.get(id=1)
        fieldLabel = comment._meta.get_field("text").verbose_name

        self.assertEqual(fieldLabel, "Comment text")

    def testCreatedLabel(self):
        comment = Comments.objects.get(id=1)
        fieldLabel = comment._meta.get_field("created").verbose_name

        self.assertEqual(fieldLabel, "created")
