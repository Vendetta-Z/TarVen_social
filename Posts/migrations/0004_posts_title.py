# Generated by Django 5.0.7 on 2024-08-30 05:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Posts', '0003_alter_posts_postfile'),
    ]

    operations = [
        migrations.AddField(
            model_name='posts',
            name='title',
            field=models.CharField(default='Config/static/image/default_avatar.png', max_length=350),
            preserve_default=False,
        ),
    ]
