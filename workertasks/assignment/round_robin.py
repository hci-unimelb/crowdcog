from workertasks.models import Task, Question
import random


def round_robin():
    tasks = Task.objects.filter(task_status=0)
    selected_task = random.choice(tasks).task_id
    questions = Question.objects.filter(task_id=selected_task)
    selected_questions = []
    for q in questions:
        selected_questions.append(q.question_id)
    return selected_task, selected_questions
