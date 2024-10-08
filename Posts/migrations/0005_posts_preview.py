# Generated by Django 5.0.7 on 2024-08-31 09:10

import Posts.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Posts", "0004_posts_title"),
    ]

    operations = [
        migrations.AddField(
            model_name="posts",
            name="preview",
            field=models.FileField(
                default=1,
                upload_to=Posts.models.getUploadFileUrl,
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["['jpeg', 'jpg', 'png']"]
                    )
                ],
            ),
            preserve_default=False,
        ),
    ]
