# Generated by Django 5.0.6 on 2024-05-11 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0009_alter_clientsaccount_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientsaccount',
            name='role',
            field=models.CharField(default='USER', max_length=10),
        ),
    ]