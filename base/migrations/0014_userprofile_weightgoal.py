# Generated by Django 3.1.4 on 2021-06-19 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_auto_20210606_1939'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='weightGoal',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
    ]
