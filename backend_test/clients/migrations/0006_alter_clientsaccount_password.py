# Generated by Django 5.0.6 on 2024-05-11 02:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0005_alter_clientsaccount_password_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientsaccount',
            name='password',
            field=models.CharField(max_length=64),
        ),
    ]
