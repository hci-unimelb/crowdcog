from workertasks.models import Worker, Condition, CognitiveTestCompletion
from workertasks.constants.constants import *
import random


def select_cognitive_tests(context):
    # Get available cognitive tests based on worker history
    condition_instance = Condition.objects.get(condition_id=context['studyCondition'])
    worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=condition_instance)

    available_tests = []
    if not worker_instance.stroop:
        available_tests.append(COGNITIVE_TEST_STROOP)
    if not worker_instance.flanker:
        available_tests.append(COGNITIVE_TEST_FLANKER)
    if not worker_instance.taskswitching:
        available_tests.append(COGNITIVE_TEST_TASK_SWITCHING)
    if not worker_instance.nback:
        available_tests.append(COGNITIVE_TEST_N_BACK)
    if not worker_instance.pointing:
        available_tests.append(COGNITIVE_TEST_POINTING)

    if len(available_tests) > 0:
        # Randomly select a predefined number of tests form the available ones
        tests_to_select = MAX_NUMBER_OF_COGNITIVE_TESTS_PER_ASSIGNMENT if MAX_NUMBER_OF_COGNITIVE_TESTS_PER_ASSIGNMENT < len(available_tests) else len(available_tests)
        context['cognitiveTestsAssigned'] = random.sample(available_tests, tests_to_select)

    else:
        context['cognitiveTestsAssigned'] = []

    return context
