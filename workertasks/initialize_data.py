from workertasks.models import Worker, Task, Question, Condition, Assignment
from workertasks.constants.constants import *
import json

ASSIGNMENTS_PER_QUESTION = 8


def create_conditions():
    Condition.objects.create(condition_id=0, condition_name='baseline')
    Condition.objects.create(condition_id=1, condition_name='cognitive-assign')
    Condition.objects.create(condition_id=2, condition_name='cognitive-recommend')
    Condition.objects.create(condition_id=3, condition_name='qasca')
    Condition.objects.create(condition_id=4, condition_name='crowd-dqs')

def create_tasks():
    task_list = []
    task_uid = 1000
    for condition in [0,1,2,3,4]:
        for task_id in [1,2,3,4,5]:
            task_list.append(Task(task_uid=task_uid, condition_id_id=condition, task_id=task_id, number_of_questions=12))
            task_uid = task_uid + 1

    Task.objects.bulk_create(task_list)


def create_questions():
    all_tasks = Task.objects.all()
    question_uid = 5000
    question_list = []
    for t in all_tasks:
        for question_id in [1,2,3,4,5,6,7,8,9,10,11,12]:
            Question.objects.create(question_uid=question_uid, question_id=question_id, task_uid=t,
                                    condition_id_id=t.condition_id_id, available_assignments=ASSIGNMENTS_PER_QUESTION,
                                    total_assignments=ASSIGNMENTS_PER_QUESTION)
            question_uid = question_uid + 1


    # Question.objects.bulk_create(question_list)

#create_conditions()
#create_tasks()
#create_questions()

# --------------------------------------------------------------
# Use the following command in Django Console to run this file
# exec(open('workertasks/initialize_data.py').read())
# --------------------------------------------------------------

def init_qasca():
    # Initialise Distribution for Sentiment Analysis
    sentiment_task = Task.objects.get(task_id=int(CROWD_TASK_LABELS[CROWD_TASK_SENTIMENT]), condition_id_id=int(STUDY_CONDITION_QASCA))

    sentiment_questions = Question.objects.filter(task_uid=sentiment_task.task_uid)

    for q in sentiment_questions:
        q.distribution = json.dumps([1.0/3]*3)
        q.save()

    # Initialise Distribution for Counting
    counting_task = Task.objects.get(task_id=int(CROWD_TASK_LABELS[CROWD_TASK_COUNTING]),
                                     condition_id_id=int(STUDY_CONDITION_QASCA))

    counting_questions = Question.objects.filter(task_uid=counting_task.task_uid)

    for q in counting_questions:
        q.distribution = json.dumps([1.0 / 3] * 3)
        q.save()

    # Initialise Distribution for Classification
    classification_task = Task.objects.get(task_id=int(CROWD_TASK_LABELS[CROWD_TASK_CLASSIFICATION]), condition_id_id=int(STUDY_CONDITION_QASCA))

    classification_questions = Question.objects.filter(task_uid=classification_task.task_uid)

    for q in classification_questions:
        q.distribution = json.dumps([1.0 / 2] * 2)
        q.save()

init_qasca()