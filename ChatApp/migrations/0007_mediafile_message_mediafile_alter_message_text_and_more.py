# Generated by Django 5.0.7 on 2024-10-02 00:33

import ChatApp.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChatApp', '0006_alter_hiddenmessage_message'),
    ]

    operations = [
        migrations.CreateModel(
            name='MediaFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=ChatApp.models.getUploadFileUrl)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='message',
            name='mediaFile',
            field=models.FileField(default=1, upload_to=ChatApp.models.getUploadFileUrl),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='message',
            name='text',
            field=models.TextField(max_length=400),
        ),
        migrations.AlterField(
            model_name='reply',
            name='text',
            field=models.TextField(max_length=400),
        ),
    ]
