# Generated by Django 5.0.7 on 2024-09-01 02:34

import Posts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Posts", "0005_posts_preview"),
    ]

    operations = [
        migrations.RenameField(
            model_name="saved_post",
            old_name="save_post",
            new_name="post",
        ),
        migrations.RenameField(
            model_name="saved_post",
            old_name="user_saved_post",
            new_name="user",
        ),
        migrations.AlterField(
            model_name="posts",
            name="preview",
            field=models.ImageField(upload_to=Posts.models.getUploadFileUrl),
        ),
    ]
