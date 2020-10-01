

var welcome = {
    type: "html-button-response",
    stimulus: "Select the task",
    margin_vertical: '8px',
    choices: ['Task Switching','Flanker','Stroop','N-Back','Ordering','Proofreading','Counting',
        'Classification','Sentiment','All','Card Sorting','Transcription','Questionnaire'],
    horizontal: false
};

// var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

let timeline = [];
timeline.push(welcome);

jsPsych.init({
    timeline: timeline,
    on_finish: function(data) {
        var response = jsPsych.data.get().select('button_pressed').values[0];
        var newTimeline = null;

        switch(response){
            case '7': newTimeline = classification(); break;
            case '1': newTimeline = flanker(); break;
            case '2': newTimeline = stroop(); break;
            case '8': newTimeline = sentiment(); break;
            case '5': newTimeline = proofreading(); break;
            case '6': newTimeline = counting(); break;
            case '0': newTimeline = taskSwitching(); break;
            case '3': newTimeline = nBack(); break;
            case '4': newTimeline = pointing(); break;
            case '9': $.getScript('/static/js/full-flow.js'); break;
            case '10': $.getScript('/static/js/card-sorting.js'); break;
            case '11': newTimeline = transcription(); break;
            case '12': newTimeline = questionnaire(); break;

        }

        if(newTimeline !== null){

            jsPsych.init({
                timeline: newTimeline,
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
                                console.log(trialData);
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
                                console.log(trialData);
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
                                console.log(trialData);
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
                                console.log(trialData);
                                break;
                            }
                        }
                    }
                    },
                on_finish: function (data) {
                    jsPsych.data.displayData('json');
                },
                show_progress_bar: true,
                auto_update_progress_bar: false
            });
        }
    }
});