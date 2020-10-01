import os
from django.conf import settings

from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import make_regression
import pickle, csv
import pandas as pd
from workertasks.constants.constants import *

all_feature_cols = []

feature_cols_by_test = {
    COGNITIVE_TEST_STROOP: ['stroop.acc', 'stroop.effect.acc', 'stroop.rt', 'stroop.effect.rt'],
    COGNITIVE_TEST_FLANKER: ['flanker.acc', 'flanker.rt', 'flanker.effect.acc', 'flanker.effect.rt'],
    COGNITIVE_TEST_N_BACK: ['n-back.acc', 'n-back.rt'],
    COGNITIVE_TEST_POINTING: ['pointing.acc', 'pointing.rt'],
    COGNITIVE_TEST_TASK_SWITCHING: ['task-switching.acc', 'task-switching.rt', 'task-switching.effect.acc',
                                    'task-switching.effect.rt']
}

feature_cols = {
    CROWD_TASK_CLASSIFICATION: feature_cols_by_test[COGNITIVE_TEST_STROOP] +
                               feature_cols_by_test[COGNITIVE_TEST_FLANKER] +
                               feature_cols_by_test[COGNITIVE_TEST_POINTING],
    CROWD_TASK_COUNTING: feature_cols_by_test[COGNITIVE_TEST_STROOP] +
                         feature_cols_by_test[COGNITIVE_TEST_FLANKER] +
                         feature_cols_by_test[COGNITIVE_TEST_POINTING],
    CROWD_TASK_PROOFREADING: feature_cols_by_test[COGNITIVE_TEST_POINTING] +
                             feature_cols_by_test[COGNITIVE_TEST_TASK_SWITCHING],
    CROWD_TASK_SENTIMENT: feature_cols_by_test[COGNITIVE_TEST_STROOP] +
                          feature_cols_by_test[COGNITIVE_TEST_FLANKER],
    CROWD_TASK_TRANSCRIPTION: feature_cols_by_test[COGNITIVE_TEST_TASK_SWITCHING]
}


def build_models():
    train = pd.read_csv(
        os.path.join(settings.BASE_DIR,'data/cognitive_test_results.csv'))

    for task in list(feature_cols.keys()):
        X = train.loc[:, feature_cols[task]]
        y = train[task + '.acc']

        regr = RandomForestRegressor(max_depth=2, random_state=0, n_estimators=1000)
        regr.fit(X, y)

        filename = 'rf_model_' + task + '.sav'
        filename = os.path.join(settings.BASE_DIR, 'workertasks/assignment/' + filename)
        # save model
        pickle.dump(regr, open(filename, 'wb'))

build_models()

# Run the file using django console
# exec(open('workertasks/assignment/build_cognitive_model.py').read())