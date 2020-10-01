
// var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

var timeline = [];

var welcome_block = {
    type: "html-button-response",
    stimulus: "<p><strong>Welcome</strong></p>" +
    "<p>You will complete 10 tasks (5 cognitive tests and 5 crowdsourcing tasks).</p>" +
    "<p><strong>Read the instructions carefully </strong> before starting each task. Instructions will not be repeated.</p> ",
    choices: ['Continue']
};

timeline.push(welcome_block);


var cognitiveTests  = [stroop(),flanker(),taskSwitching(),pointing(),nBack()];

var randomIndex = jsPsych.randomization.shuffle([0,1,2,3,4]);

for (let t in randomIndex){
    var taskNumber = t*1+1;
    timeline.push({
        type: "html-button-response",
        stimulus: "<p><strong>Task "+ taskNumber +
        "</strong></p><p>&nbsp;</p>",
        choices: ['Continue'],
        on_load: function () {
            jsPsych.setProgressBar((t*1)*0.1);
        }
    });
    timeline = timeline.concat(cognitiveTests[randomIndex[t]]);
}

var crowdsourcingTasks = [proofreading(),sentiment(),counting(),classification(),transcription()];

randomIndex = jsPsych.randomization.shuffle([0,1,2,3,4]);

for (let t in randomIndex){
    var taskNumber = t*1+6;
    timeline.push({
        type: "html-button-response",
        stimulus: "<p><strong>Task "+ taskNumber +
        "</strong></p><p>&nbsp;</p>",
        choices: ['Continue'],
        on_load: function () {
            // console.log((t*1-1)*10);
            jsPsych.setProgressBar((t*1)*0.1+0.5);
        }
    });
    timeline = timeline.concat(crowdsourcingTasks[randomIndex[t]]);
}

timeline.push({
    type: "html-button-response",
    stimulus: "<p><strong>You have completed all the tasks." +
    "</strong></p><p>Click the button below to answer 3 demographics questions.</p>",
    choices: ['Continue'],
    button_htm: ['<button class="jspsych-btn">%choice%</button>'],
    on_load: function () {
        jsPsych.setProgressBar(0.98);
    }
});

timeline = timeline.concat(questionnaire());

timeline.push({
    type: "html-button-response",
    stimulus: "<p><strong>Thank You!" +
    "</strong></p><p>Click the button below to return to Mechanical Turk to submit your answers.</p>",
    choices: ['Complete'],
    button_htm: ['<button class="jspsych-btn">%choice%</button>'],
    on_load: function () {
        jsPsych.setProgressBar(1);
    }
});

jsPsych.init({
    timeline: timeline,
    on_data_update: function(data) {
        if(typeof data.trial_category !== undefined){
            switch (data.trial_category){
                case 'stroop':
                case 'n-back':
                case 'flanker':
                case 'task-switching':
                case 'sentiment':
                case 'counting':
                case 'classification':
                case 'proofreading':{
                    const trialData = {
                        rt: data.rt,
                        is_correct: data.correct,
                        unique_trial_id: data.unique_trial_id,
                        trial_category: data.trial_category,
                        trial_index: data.trial_index,
                        response: data.response
                    };
                    // console.log(trialData);
                    // psiturk.recordTrialData(trialData);
                    break;
                }
                case 'questionnaire':
                case 'transcription':{
                    const trialData = {
                        rt: data.rt,
                        unique_trial_id: data.unique_trial_id,
                        trial_category: data.trial_category,
                        trial_index: data.trial_index,
                        response: data.response
                    };
                    // console.log(trialData);
                    // psiturk.recordTrialData(trialData);
                    break;
                }
                case 'pointing':{
                    const trialData = {
                        rt: data.rt,
                        is_correct: data.correct,
                        unique_trial_id: data.unique_trial_id,
                        trial_category: data.trial_category,
                        trial_index: data.trial_index,
                        response: data.response,
                        is_error: data.is_error
                    };
                    // psiturk.recordTrialData(trialData);
                    // console.log(trialData);
                    break;
                }
                case 'example':
                case 'instructions': {
                    const trialData = {
                        rt: data.rt,
                        unique_trial_id: data.unique_trial_id,
                        trial_category: data.trial_category,
                        trial_index: data.trial_index,
                    };
                    // psiturk.recordTrialData(trialData);
                    // console.log(trialData);
                    break;
                }
            }

        }
    },
    on_finish: function (data) {
        // psiturk.saveData({
        //     success: function() {
        //         psiturk.completeHIT();
        //     }
        // });
    },
    show_progress_bar: true,
    auto_update_progress_bar: false
});