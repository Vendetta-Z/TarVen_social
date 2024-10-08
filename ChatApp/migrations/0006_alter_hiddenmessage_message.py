# Generated by Django 5.0.7 on 2024-09-30 22:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChatApp', '0005_hiddenmessage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hiddenmessage',
            name='message',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hidden_message_by_user', to='ChatApp.message'),
        ),
    ]
