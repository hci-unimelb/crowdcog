let newTimeline = [];

switch (selectedTask) {
    case crowdTasks.CLASSIFICATION:
        newTimeline = newTimeline.concat(classification(questions));
        break;
    case crowdTasks.SENTIMENT:
        newTimeline = newTimeline.concat(sentiment(questions));
        break;
    case crowdTasks.PROOFREADING:
        newTimeline = newTimeline.concat(proofreading(questions));
        break;
    case crowdTasks.COUNTING:
        newTimeline = newTimeline.concat(counting(questions));
        break;
    case crowdTasks.TRANSCRIPTION:
        newTimeline = newTimeline.concat(transcription(questions));
        break;
}

console.log(newTimeline);

jsPsych.init({
    timeline: newTimeline,
    on_data_update: function (data) {
        if (typeof data.trial_category !== undefined) {
            switch (data.trial_category) {
                case crowdTasks.SENTIMENT:
                case crowdTasks.COUNTING:
                case crowdTasks.CLASSIFICATION:
                case crowdTasks.PROOFREADING: {
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
                case crowdTasks.TRANSCRIPTION: {
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
                case 'pointing': {
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
        let answers = [];
        let question_answer_list = [];
        if (selectedTask==crowdTasks.SENTIMENT){
            answers = jsPsych.data.get().filter({trial_category: crowdTasks.SENTIMENT}).select('button_pressed').values;
            for(let k=0; k < questions.length;k++){
                let obj = {};
                obj['a'] = answers[k];
                obj['q'] = questions[k];
                obj['t'] = selectedTask;
                question_answer_list.push(obj)
            }
        } else if (selectedTask==crowdTasks.COUNTING){
            answers = jsPsych.data.get().filter({trial_category: crowdTasks.COUNTING}).select('response').values;
            let correct_answers = jsPsych.data.get().filter({trial_category: crowdTasks.COUNTING}).select('correct_response').values;
            for(let k=0; k < questions.length;k++){
                let obj = {};
                if (parseInt(answers[k]) < parseInt(correct_answers[k]) - 1) {
                    obj['a'] = '0';
                } else if (parseInt(answers[k]) > parseInt(correct_answers[k]) + 1){
                    obj['a'] = '2';
                } else {
                    obj['a'] = '1';
                }
                obj['q'] = questions[k];
                obj['t'] = selectedTask;
                question_answer_list.push(obj)
            }
        } else if (selectedTask==crowdTasks.CLASSIFICATION){
            answers = jsPsych.data.get().filter({trial_category: crowdTasks.CLASSIFICATION}).select('response').values;
            let correct_answers = jsPsych.data.get().filter({trial_category: crowdTasks.CLASSIFICATION}).select('answer').values;
            for(let k=0; k < questions.length;k++){
                let obj = {};
                if (answers[k].length > 0){
                    if (answers[k].includes(correct_answers[k][0])) {
                        obj['a'] = '1';
                    } else {
                        obj['a'] = '0';
                    }
                } else {
                    obj['a'] = '0';
                }
                obj['q'] = questions[k];
                obj['t'] = selectedTask;
                question_answer_list.push(obj)
            }
        }
        console.log(question_answer_list);

        $.ajax({
                type: "POST",
                url: '/workertasks/complete?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId,
                data: {
                    'data': JSON.stringify({
                        'summary' : "good",
                        'csv' : jsPsych.data.get().csv(),
                        'answers' : question_answer_list,
                    }),

                    'csrfmiddlewaretoken': WINDOW_CSRF_TOKEN
                },
                success : function (response) {
                    console.log(response);
                    // $.ajax({
                    //     type: "POST",
                    //     url: 'https://workersandbox.mturk.com/mturk/externalSubmit?assignmentId=' + assignmentId + '&answer=good',
                    //     success : function (response) {
                    //         console.log(response);
                    //         window.location.replace('/workertasks/complete?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId);
                    //     },
                    // });
                    window.location.replace('/workertasks/complete?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId);
                },
                dataType: 'json'
            });
    },
    show_progress_bar: false,
    auto_update_progress_bar: false

});