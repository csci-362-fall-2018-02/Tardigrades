# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-11-05 03:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('externalsites', '0002_auto_20180904_1903'),
    ]

    operations = [
        migrations.AddField(
            model_name='youtubeaccount',
            name='sync_metadata',
            field=models.BooleanField(default=True),
        ),
    ]
