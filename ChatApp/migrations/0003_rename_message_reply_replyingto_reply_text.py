# Generated by Django 5.0.7 on 2024-09-24 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChatApp', '0002_reply'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reply',
            old_name='message',
            new_name='replyingTo',
        ),
        migrations.AddField(
            model_name='reply',
            name='text',
            field=models.TextField(default=1),
            preserve_default=False,
        ),
    ]
