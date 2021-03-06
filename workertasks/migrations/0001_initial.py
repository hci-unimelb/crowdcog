# Generated by Django 2.1.3 on 2018-11-09 00:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('assignment_id', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('begin_hit', models.DateTimeField()),
                ('begin_exp', models.DateTimeField()),
                ('end_hit', models.DateTimeField()),
                ('status', models.IntegerField(choices=[(0, 'Started'), (1, 'Working'), (2, 'Completed'), (3, 'Abandoned')])),
            ],
        ),
        migrations.CreateModel(
            name='Worker',
            fields=[
                ('worker_id', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('status', models.IntegerField(choices=[(0, 'New'), (1, 'Working'), (2, 'Completed')])),
                ('qualification', models.IntegerField()),
            ],
        ),
        migrations.AddField(
            model_name='assignment',
            name='worker_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workertasks.Worker'),
        ),
    ]
