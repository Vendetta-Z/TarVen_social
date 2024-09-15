from django.test import TestCase

from Comments.models import Comments
from Users.models import User
from Posts.models import Posts


class PostsModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        user = User.objects.create(
            first_name='Test',
            last_name='test',
            status='test',
            password='test123123'
        )

        post = Posts.objects.create(
            author=user,
            description = 'test description',
            title = 'test',
        )

        Comments.objects.create(
            author=user,
            post=post,
            text='test'
        )

    def testAuthorLabel(self):
        post = Posts.objects.get(id=1)
        fieldLabel = post._meta.get_field('author').verbose_name

        self.assertEqual(fieldLabel, 'author')

    def testDescriptionLabel(self):
        post = Posts.objects.get(id=1)
        fieldLabel = post._meta.get_field('description').verbose_name

        self.assertEqual(fieldLabel, 'description')

    def testCreatedLabel(self):
        post = Posts.objects.get(id=1)
        fieldLabel = post._meta.get_field('created').verbose_name

        self.assertEqual(fieldLabel, 'created')

    def testTitleLabel(self):
        post = Posts.objects.get(id=1)
        fieldLabel = post._meta.get_field('title').verbose_name

        self.assertEqual(fieldLabel, 'title')

    def testPostFileLabel(self):
        post = Posts.objects.get(id=1)
        fieldLabel = post._meta.get_field('PostFile').verbose_name

        self.assertEqual(fieldLabel, 'PostFile')

