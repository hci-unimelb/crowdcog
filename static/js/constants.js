const cognitiveTests = {
    FLANKER: 'flanker',
    STROOP: 'stroop',
    TASK_SWITCHING: 'task-switching',
    N_BACK: 'n-back',
    POINTING: 'pointing',
    LABELS: {
        FLANKER: "Flanker"
    }
};

const cognitiveTestMetrics = {
    ACCURACY: 'accuracy',
    RT: 'rt',
    EFFECT_ACCURACY: 'eff_acc',
    EFFECT_RT: 'eff_rt'
    // CONGRUENT_ACCURACY: 'con_acc',
    // CONGRUENT_RT: 'con_rt',
    // INCONGRUENT_ACCURACY: 'inc_acc',
    // INCONGRUENT_RT: 'inc_rt'
};

const crowdTasks = {
    SENTIMENT: 'sentiment',
    COUNTING: 'counting',
    CLASSIFICATION: 'classification',
    PROOFREADING: 'proofreading',
    TRANSCRIPTION: 'transcription',
    LABELS: {
        SENTIMENT: 'Sentiment',
        COUNTING: 'Counting',
        CLASSIFICATION: 'Classification',
        TRANSCRIPTION: 'Transcription',
        PROOFREADING: 'Proofreading'
    }
};

const crowdTaskMapping = {
    '1': crowdTasks.CLASSIFICATION,
    '2': crowdTasks.COUNTING,
    '3': crowdTasks.PROOFREADING,
    '4': crowdTasks.SENTIMENT,
    '5': crowdTasks.TRANSCRIPTION,
};

const conditions = {
    BASELINE: 0,
    COGNITIVE_ASSIGN: 1,
    COGNITIVE_RECOMMEND: 2,
    QASCA: 3,
    CROWD_DQS: 4
};

const NO_TASKS_RECOMMENDED = "NO_TASKS_RECOMMENDED";