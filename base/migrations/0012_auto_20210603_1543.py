# Generated by Django 3.1.4 on 2021-06-03 14:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0011_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='birthDate',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
