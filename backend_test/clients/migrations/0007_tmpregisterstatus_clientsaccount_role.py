# Generated by Django 5.0.6 on 2024-05-11 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0006_alter_clientsaccount_password'),
    ]

    operations = [
        migrations.CreateModel(
            name='TmpRegisterStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_id', models.CharField(max_length=50, unique=True)),
                ('status', models.CharField(max_length=10)),
                ('remake', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='clientsaccount',
            name='role',
            field=models.CharField(default='NULL', max_length=10),
            preserve_default=False,
        ),
    ]
