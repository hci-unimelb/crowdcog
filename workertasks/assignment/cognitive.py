import os
from django.conf import settings
from django.core.files import File

import uuid
import json

from sklearn.ensemble import RandomForestRegressor
import pickle

from workertasks.constants.constants import *
from workertasks.models import Worker, CognitiveTestCompletion
from workertasks.assignment.build_cognitive_model import feature_cols, feature_cols_by_test
import numpy as np


def assign(context, request, available_tasks):
    test_data = None
    if request.method == 'POST':
        test_data = request.POST.get('data')

    worker_instance = Worker.objects.get(worker_id=context['workerId'], condition_id=context['studyCondition'])
    possible_tasks = []

    if test_data is not None:
        test_results = json.loads(test_data)

        for test, result in test_results['summary'].items():
            if 'eff_acc' in result:
                test_completion_instance = CognitiveTestCompletion.objects.create(test_id=test,
                                                                                  test_uid=uuid.uuid4(),
                                                                                  worker_uid_id=worker_instance.worker_uid,
                                                                                  condition_id_id=context['studyCondition'],
                                                                                  accuracy=result['accuracy'],
                                                                                  rt=result['rt'],
                                                                                  effect_accuracy=result['eff_acc'],
                                                                                  effect_rt=result['eff_rt'])
            else:
                test_completion_instance = CognitiveTestCompletion.objects.create(test_id=test,
                                                                                  test_uid=uuid.uuid4(),
                                                                                  worker_uid_id=worker_instance.worker_uid,
                                                                                  condition_id_id=context['studyCondition'],
                                                                                  accuracy=result['accuracy'],
                                                                                  rt=result['rt'])

            if test == COGNITIVE_TEST_STROOP:
                worker_instance.stroop = True
            elif test == COGNITIVE_TEST_FLANKER:
                worker_instance.flanker = True
            elif test == COGNITIVE_TEST_TASK_SWITCHING:
                worker_instance.taskswitching = True
            elif test == COGNITIVE_TEST_N_BACK:
                worker_instance.nback = True
            elif test == COGNITIVE_TEST_POINTING:
                worker_instance.pointing = True

        worker_instance.save()

    if worker_instance.stroop & worker_instance.flanker & worker_instance.pointing:
        possible_tasks.append(CROWD_TASK_CLASSIFICATION)
        possible_tasks.append(CROWD_TASK_COUNTING)
    if worker_instance.taskswitching:
        possible_tasks.append(CROWD_TASK_TRANSCRIPTION)
    if worker_instance.taskswitching & worker_instance.pointing:
        possible_tasks.append(CROWD_TASK_PROOFREADING)
    if worker_instance.stroop & worker_instance.flanker:
        possible_tasks.append(CROWD_TASK_SENTIMENT)

    # Load and combine all current and previous results
    completed_tests = CognitiveTestCompletion.objects.filter(worker_uid_id=worker_instance.worker_uid, condition_id_id=context['studyCondition'])

    test_results_all = {}

    for t in completed_tests:
        test_results_all[t.test_id] = {
            'acc': t.accuracy,
            'rt': t.rt,
            'effect.acc': t.effect_accuracy,
            'effect.rt': t.effect_rt
        }

    eligible_tasks = []

    for task in possible_tasks:
        if str(CROWD_TASK_LABELS[task]) in available_tasks:
            features = feature_cols[task]
            feature_scores = []
            for feature_name in features:
                test_name, metric_name = feature_name.split('.', 1)
                feature_scores.append(test_results_all[test_name][metric_name])

            filename = 'rf_model_' + task + '.sav'
            filename = os.path.join(settings.BASE_DIR, 'workertasks/assignment/' + filename)

            with open(filename,'rb') as f:
                rf_model = pickle.load(f)

                # predict performance
                feature_scores_modified = np.reshape(feature_scores, (1, -1))
                res = rf_model.predict(feature_scores_modified)
                # print(task)
                # print(res)

            if res[0] >= CROWD_TASK_THRESHOLDS[task]:
                eligible_tasks.append(CROWD_TASK_LABELS[task])

    print("Assignment", eligible_tasks)
    if len(eligible_tasks) == 0:
        return 'NO_TASKS_RECOMMENDED'
    else:
        return eligible_tasks
