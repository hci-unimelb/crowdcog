import random
import uuid

from workertasks.constants.constants import *
from workertasks.models import Question, Task, QuestionCompletion, Worker, Condition
from django.db.models import F
from workertasks.assignment.em import *

def assign_questions(context):
    """
    Assign questions according to the study condition
    :param context:
    :return: context
    """

    # Get available questions from table
    worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=context['studyCondition'])
    task_instance = Task.objects.get(task_id=CROWD_TASK_LABELS[context['selectedTask']],
                                     condition_id=context['studyCondition'])
    questions_qs = Question.objects.filter(task_uid=task_instance.task_uid, available_assignments__gt=0)

    worker_completed_questions_qs = QuestionCompletion.objects.filter(worker=worker_instance,
                                                                      condition_id=context['studyCondition'],
                                                                      question_id__in=questions_qs.values(
                                                                          'question_uid'))

    worker_completed_questions = list(map(lambda q: q.question_id, worker_completed_questions_qs))
    available_questions = []

    for question in questions_qs:
        if question.question_uid not in worker_completed_questions:
            available_questions.append(question.question_id)

    print(available_questions)

    selected_questions = []

    if context['studyCondition'] == STUDY_CONDITION_BASELINE or \
            context['studyCondition'] == STUDY_CONDITION_COGNITIVE_ASSIGN or \
            context['studyCondition'] == STUDY_CONDITION_COGNITIVE_RECOMMEND:
        # Select random questions from the available question pool
        selected_questions = random.sample(available_questions,
                                           NUMBER_OF_QUESTIONS_PER_ASSIGNMENT if NUMBER_OF_QUESTIONS_PER_ASSIGNMENT <= len(
                                               available_questions) else len(available_questions))
    elif context['studyCondition'] == STUDY_CONDITION_CROWD_DQS:
        # TODO: Select questions based on assignment strategy
        selected_questions = [2, 3]
    elif context['studyCondition'] == STUDY_CONDITION_QASCA:
        questions = Question.objects.filter(condition_id_id=context['studyCondition'], task_uid=task_instance.task_uid, question_id__in=available_questions)
        selected_questions_instances = assign_qasca(questions, NUMBER_OF_QUESTIONS_PER_ASSIGNMENT if NUMBER_OF_QUESTIONS_PER_ASSIGNMENT <= len(
                                               available_questions) else len(available_questions), worker_instance.quality)
        selected_questions = list(map(lambda x: x.question_id, selected_questions_instances))
        print(selected_questions)
    # Reduce available assignments for selected questions
    selected_questions_qs = Question.objects.filter(question_id__in=selected_questions, task_uid=task_instance)
    selected_questions_qs.update(available_assignments=F('available_assignments') - 1)

    for question in selected_questions_qs:
        QuestionCompletion.objects.create(question_completion_uid=uuid.uuid4(),
                                          question=question, task=task_instance,
                                          worker=worker_instance, condition_id=context['studyCondition'],
                                          question_status=1)

    context['questions'] = selected_questions
    return context
