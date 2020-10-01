import os
import requests
import uuid
from django.http import HttpResponse, JsonResponse
from django.template import loader

from workertasks.models import Worker, Task, Question, Condition, Assignment, QuestionCompletion
from workertasks.constants.constants import *

# condition_value = os.environ.get('STUDY_CONDITION')
condition_value = '3'
using_sandbox = True


def index(request):
    template = loader.get_template('workertasks/test.html')
    context = read_params(request, condition_value)
    if not (context['assignmentId'] == 'ASSIGNMENT_ID_NOT_AVAILABLE' or context['assignmentId'] == ''):
        condition_instance = Condition.objects.get(condition_id=condition_value)
        is_new_worker = True
        worker_instance = {}
        try:
            # Get the worker instance
            worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=condition_instance)
            is_new_worker = False
        except Worker.DoesNotExist:
            # Create a new worker instance
            worker_instance = Worker.objects.create(worker_uid=uuid.uuid4(), worker_id=context['workerId'],
                                                    condition_id=condition_instance)

        assignment_instance, created = Assignment.objects.get_or_create(assignment_uid=context['assignmentId'], worker_uid_id=worker_instance.worker_uid)

        if assignment_instance.status not in [1, 2, 3]:
            tasks_available_uid = Question.objects.filter(condition_id_id=condition_value, available_assignments__gt=0).values('task_uid_id').distinct()
            # query_set_length = Task.objects.filter(task_uid__in=tasks_available_uid).count()

            tasks_available = False

            for task in tasks_available_uid:
                completed_questions = QuestionCompletion.objects.filter(task_id=task['task_uid_id'], worker=worker_instance, condition=condition_instance).count()
                if completed_questions < Task.objects.get(task_uid=task['task_uid_id']).number_of_questions:
                    tasks_available = True
                else:
                    tasks_available = tasks_available or False
            # Check if the worker has given consent
            context['consentGiven'] = worker_instance.consent_given

            if tasks_available:
                assignment_instance.status = 1
                import datetime
                from django.utils.timezone import utc
                now = datetime.datetime.utcnow().replace(tzinfo=utc)
                assignment_instance.begin_hit = now
                assignment_instance.save()
                return HttpResponse(template.render(context, request))
            else:
                # There are no tasks left for the worker under the current conditions
                context['errornum'] = 1020
                context['errordesc'] = 'No tasks available'
                context['contact_address'] = contact_address
                template = loader.get_template('workertasks/error.html')
                return HttpResponse(template.render(context, request))
        elif assignment_instance.status == 2:
            # Complete assignment
            context['errornum'] = 1022
            context['errordesc'] = 'Complete assignment'
            context['contact_address'] = contact_address
            template = loader.get_template('workertasks/mturksubmit.html')
            return HttpResponse(template.render(context, request))
        else:
            # Incomplete assignment
            context['errornum'] = 1021
            context['errordesc'] = 'Incomplete assignment'
            context['contact_address'] = contact_address
            template = loader.get_template('workertasks/error.html')
            return HttpResponse(template.render(context, request))

    else:
        # Load the preview page
        print("## Worker not loaded")
        return HttpResponse(template.render(context, request))


def consent(request):
    template = loader.get_template('workertasks/consent.html')
    context = read_params(request, condition_value)
    print(request.GET.get('consentGiven', 'False'))
    consent_given = True if request.GET.get('consentGiven', 'False') == 'True' else False
    if consent_given:
        return cognitivetests(request)
    else:
        return HttpResponse(template.render(context, request))


def cognitivetests(request):
    print("Cognitive Tests")
    context = read_params(request, condition_value)

    # save the consent state
    condition_instance = Condition.objects.get(condition_id=condition_value)
    worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=condition_instance)
    worker_instance.consent_given = True
    worker_instance.save()

    # select two cognitive tests if condition is cognitive
    if condition_value == STUDY_CONDITION_COGNITIVE_ASSIGN or condition_value == STUDY_CONDITION_COGNITIVE_RECOMMEND:
        from workertasks.assignment.cogitive_test_selection import select_cognitive_tests
        context = select_cognitive_tests(context)
    template = loader.get_template('workertasks/cognitivetests.html')
    return HttpResponse(template.render(context, request))


def taskselection(request):
    print("Task Selection")
    context = read_params(request, condition_value)
    worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=condition_value)
    tasks_available_uid = Question.objects.filter(condition_id_id=condition_value, available_assignments__gt=0).values(
        'task_uid_id').distinct()

    tasks_available_uid_list = []
    for task in tasks_available_uid:
        completed_questions = QuestionCompletion.objects.filter(task_id=task['task_uid_id'], worker=worker_instance,
                                                                condition=condition_value).count()
        if completed_questions < Task.objects.get(task_uid=task['task_uid_id']).number_of_questions:
            tasks_available_uid_list.append(task['task_uid_id'])

    # get all tasks with questions available
    available_tasks_qs = Task.objects.filter(condition_id=condition_value, task_uid__in=tasks_available_uid_list)\
        .filter(task_status__in=[0, 1]).only("task_id")
    available_tasks = list(map(lambda t: t.task_id, available_tasks_qs))

    if request.POST:
        # handle data posted after completing cognitive tests
        from workertasks.assignment.cognitive import assign

        recommended_tasks = assign(context, request, available_tasks)
        return JsonResponse({'recommendedTasks': recommended_tasks, 'flag': True})
    else:
        completed_cognitive_tests_current = True
        template = loader.get_template('workertasks/taskselection.html')
        context['availableTasks'] = available_tasks

        if condition_value is STUDY_CONDITION_COGNITIVE_ASSIGN or condition_value is STUDY_CONDITION_COGNITIVE_RECOMMEND:
            if context['recommendedTasks'] is '':
                completed_cognitive_tests_current = False
                from workertasks.assignment.cognitive import assign
                context['recommendedTasks'] = assign(context, request, available_tasks)

        # Update available tasks and recommended tasks of the assignment
        assignment_instance = Assignment.objects.get(worker_uid=worker_instance, assignment_uid=context['assignmentId'])
        assignment_instance.tasks_available = available_tasks
        assignment_instance.task_attempted = context['selectedTask']
        assignment_instance.tasks_recommended = context['recommendedTasks']
        assignment_instance.save()

        # If no tasks recommended
        if context['recommendedTasks'] == 'NO_TASKS_RECOMMENDED' and condition_value is STUDY_CONDITION_COGNITIVE_ASSIGN:
            if completed_cognitive_tests_current:
                context = read_params(request, condition_value)
                worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=condition_value)
                assignment_instance = Assignment.objects.get(worker_uid=worker_instance.worker_uid,
                                                             assignment_uid=context['assignmentId'])
                assignment_instance.status = 2
                import datetime
                from django.utils.timezone import utc
                now = datetime.datetime.utcnow().replace(tzinfo=utc)
                assignment_instance.end_hit = now
                assignment_instance.save()

                return complete(request)
            else:
                context['errornum'] = 1023
                context['errordesc'] = 'No tasks available'
                context['contact_address'] = contact_address
                template = loader.get_template('workertasks/error.html')
                return HttpResponse(template.render(context, request))
        else:
            print("$$$", context)
            return HttpResponse(template.render(context, request))


def exp(request):
    print("Exp")
    from workertasks.assignment.question_assignment import assign_questions
    template = loader.get_template('workertasks/exp.html')
    context = read_params(request, condition_value)
    context = assign_questions(context)
    return HttpResponse(template.render(context, request))


def complete(request):

    if request.POST:
        # Save crowd task data
        context = read_params(request, condition_value)
        import json
        worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=condition_value)
        test_results = json.loads(request.POST.get('data'))
        print(test_results)
        assignment_instance = Assignment.objects.get(worker_uid=worker_instance.worker_uid, assignment_uid=context['assignmentId'])
        assignment_instance.data = test_results['csv']
        assignment_instance.status = 2
        import datetime
        from django.utils.timezone import utc
        now = datetime.datetime.utcnow().replace(tzinfo=utc)
        assignment_instance.end_hit = now
        assignment_instance.save()
        
        # QASCA update
        if condition_value == STUDY_CONDITION_QASCA:
            question_answer_list = test_results['answers']
            # Save current answers
            task_instance = Task.objects.get(task_id=CROWD_TASK_LABELS[question_answer_list[0]['t']], condition_id=condition_value)
            for obj in question_answer_list:
                question_instance = Question.objects.get(question_id=obj['q'], condition_id=condition_value, task_uid=task_instance.task_uid)
                question_completion_instance = QuestionCompletion.objects.get(question_id=question_instance.question_uid, worker_id=worker_instance.worker_uid)
                question_completion_instance.answer = obj['a']
                question_completion_instance.save()
            print(question_answer_list)
            from workertasks.assignment.em import complete_qasca
            question_completion_instance_list = QuestionCompletion.objects.filter(condition_id=condition_value, task_id=task_instance.task_uid)
            complete_qasca(question_completion_instance_list)


        return HttpResponse(status=204)
    template = loader.get_template('workertasks/closepopup.html')
    context = read_params(request, condition_value)
    # response = requests.post('https://workersandbox.mturk.com/mturk/externalSubmit?assignmentId=' + context['assignmentId'] + '&field1=okay')
    return HttpResponse(template.render(context, request))


# Read optional url parameters
def read_params(request, study_condition):
    assignment_id = request.GET.get('assignmentId', '')
    worker_id = request.GET.get('workerId', '')
    hit_id = request.GET.get('hitId', '')
    selected_task = request.GET.get('task', '')
    recommended_tasks = request.GET.get('recommendedTasks', '')

    context = {
        'workerId': worker_id,
        'assignmentId': assignment_id,
        'hitId': hit_id,
        'selectedTask': selected_task,
        'studyCondition': study_condition,
        'recommendedTasks': recommended_tasks,
        'using_sandbox' : using_sandbox
    }
    print(context)
    return context
