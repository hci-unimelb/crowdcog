from django.db import models


class Condition(models.Model):
    CONDITION_STATUS = (
        (0, 'Not Started'),
        (1, 'Working'),
        (2, 'Completed'),
        (3, 'Abandoned')
    )
    condition_id = models.CharField(max_length=64, primary_key=True)
    condition_name = models.CharField(max_length=64)
    condition_status = models.IntegerField(choices=CONDITION_STATUS, default=0)


class Worker(models.Model):
    WORKER_STATUS = (
        (0, 'New'),
        (1, 'Working'),
        (2, 'Completed')
    )
    worker_uid = models.CharField(max_length=64, primary_key=True)
    worker_id = models.CharField(max_length=64)
    status = models.IntegerField(choices=WORKER_STATUS, default=0)
    qualification = models.IntegerField(default=0)
    condition_id = models.ForeignKey(Condition, on_delete=models.CASCADE)
    consent_given = models.BooleanField(default=False)
    stroop = models.BooleanField(default=False)
    flanker = models.BooleanField(default=False)
    taskswitching = models.BooleanField(default=False)
    nback = models.BooleanField(default=False)
    pointing = models.BooleanField(default=False)
    quality = models.FloatField(default=0.7)

    class Meta:
        unique_together = ('worker_id', 'condition_id')


class Assignment(models.Model):
    ASSIGNMENT_STATUS = (
        (0, 'Started'),
        (1, 'Working'),
        (2, 'Completed'),
        (3, 'Abandoned')
    )
    assignment_uid = models.CharField(max_length=64, primary_key=True)
    worker_uid = models.ForeignKey(Worker, on_delete=models.CASCADE)
    begin_hit = models.DateTimeField(null=True)
    begin_exp = models.DateTimeField(null=True)
    end_hit = models.DateTimeField(null=True)
    status = models.IntegerField(choices=ASSIGNMENT_STATUS, default=0)
    data = models.TextField(blank=True, null=True)
    tasks_recommended = models.TextField(blank=True, null=True)
    tasks_available = models.TextField(blank=True, null=True)
    task_attempted = models.TextField(blank=True, null=True)


class Task(models.Model):
    TASK_STATUS = (
        (0, 'Not Started'),
        (1, 'Working'),
        (2, 'Completed'),
        (3, 'Abandoned')
    )
    task_uid = models.CharField(max_length=64, primary_key=True)
    task_id = models.CharField(max_length=64)
    task_status = models.IntegerField(choices=TASK_STATUS, default=0)
    condition_id = models.ForeignKey(Condition, on_delete=models.CASCADE)
    number_of_questions = models.IntegerField()

    class Meta:
        unique_together = ('task_id', 'condition_id')


# Model for individual questions in each crowd task
class Question(models.Model):
    question_uid = models.CharField(max_length=64, primary_key=True)
    question_id = models.CharField(max_length=64)
    task_uid = models.ForeignKey(Task, on_delete=models.CASCADE)
    condition_id = models.ForeignKey(Condition, on_delete=models.CASCADE)
    total_assignments = models.IntegerField()
    available_assignments = models.IntegerField(default=0)
    distribution = models.CharField(max_length=250, default="")

    class Meta:
        unique_together = ('question_id', 'task_uid')


class CognitiveTestCompletion(models.Model):
    TEST_STATUS = (
        (0, 'Not Started'),
        (1, 'Working'),
        (2, 'Completed'),
        (3, 'Abandoned')
    )
    test_uid = models.CharField(max_length=64, primary_key=True)
    test_id = models.CharField(max_length=64)
    condition_id = models.ForeignKey(Condition, on_delete=models.CASCADE)
    worker_uid = models.ForeignKey(Worker, on_delete=models.CASCADE)
    accuracy = models.FloatField(null=True)
    rt = models.FloatField(null=True)
    effect_accuracy = models.FloatField(null=True)
    effect_rt = models.FloatField(null=True)

    class Meta:
        unique_together = ('test_id', 'worker_uid')


class QuestionCompletion(models.Model):
    QUESTION_COMPLETION_STATUS = (
        (0, 'Not Started'),
        (1, 'Working'),
        (2, 'Completed'),
        (3, 'Abandoned')
    )
    question_completion_uid = models.CharField(max_length=64, primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    question_status = models.IntegerField(choices=QUESTION_COMPLETION_STATUS, default=0)
    answer = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('question', 'worker', 'condition')



