# Generated by Django 5.0.7 on 2024-08-29 03:47

import Posts.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Posts", "0002_rename_postvidorimg_posts_postfile_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="posts",
            name="PostFile",
            field=models.FileField(
                upload_to=Posts.models.getUploadFileUrl,
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["['jpeg', 'jpg', 'png', 'mp3', 'mp4']"]
                    )
                ],
            ),
        ),
    ]
