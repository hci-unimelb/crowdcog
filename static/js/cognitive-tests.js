let timeline = [];

// Add cognitive tests to the timeline
if((condition === conditions.COGNITIVE_ASSIGN || condition === conditions.COGNITIVE_RECOMMEND) && cognitiveTestsAssigned.length > 0) {

    for (let t in cognitiveTestsAssigned) {
        switch (cognitiveTestsAssigned[t]) {
            case cognitiveTests.FLANKER:
                timeline = timeline.concat(flanker());
                break;
            case cognitiveTests.STROOP:
                timeline = timeline.concat(stroop());
                break;
            case cognitiveTests.TASK_SWITCHING:
                timeline = timeline.concat(taskSwitching());
                break;
            case cognitiveTests.N_BACK:
                timeline = timeline.concat(nBack());
                break;
            case cognitiveTests.POINTING:
                timeline = timeline.concat(pointing());
                break;
        }
    }

    console.log(timeline);

    // Run cognitive tests
    jsPsych.init({
        timeline: timeline,
        show_progress_bar: true,
        auto_update_progress_bar: false,
        on_data_update: function(data) {
            if(typeof data.trial_category !== undefined){
                switch (data.trial_category){
                    case cognitiveTests.STROOP:
                    case cognitiveTests.N_BACK:
                    case cognitiveTests.TASK_SWITCHING:
                    case cognitiveTests.FLANKER:{
                        const trialData = {
                            rt: data.rt,
                            is_correct: data.correct,
                            unique_trial_id: data.unique_trial_id,
                            trial_category: data.trial_category,
                            trial_index: data.trial_index,
                            response: data.response,
                            stimulus_type: data.stimulus_type
                        };
                        console.log(trialData);
                        break;
                    }
                    case cognitiveTests.POINTING:{
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
                }
            }
            },
        on_finish: function (data) {
            // Calculate test results
            let results = {};

            let cognitiveTestsList  = [cognitiveTests.STROOP, cognitiveTests.FLANKER, cognitiveTests.TASK_SWITCHING, cognitiveTests.POINTING, cognitiveTests.N_BACK];
            for (let t in cognitiveTestsAssigned){
                let test = cognitiveTestsAssigned[t];
                let test_results = {};
                test_results[cognitiveTestMetrics.ACCURACY] = jsPsych.data.get().filter({trial_category: test}).select('correct').mean();
                test_results[cognitiveTestMetrics.RT] = jsPsych.data.get().filter({trial_category: test}).select('rt').mean();

                if (test === cognitiveTests.STROOP || test === cognitiveTests.FLANKER){
                    let con_acc = jsPsych.data.get().filter({trial_category: test, stimulus_type: 'congruent'}).select('correct').mean();
                    let con_rt = jsPsych.data.get().filter({trial_category: test,  stimulus_type: 'congruent'}).select('rt').mean();
                    let inc_acc = jsPsych.data.get().filter({trial_category: test, stimulus_type: 'incongruent'}).select('correct').mean();
                    let inc_rt = jsPsych.data.get().filter({trial_category: test, stimulus_type: 'incongruent'}).select('rt').mean();
                    test_results[cognitiveTestMetrics.EFFECT_ACCURACY] = con_acc - inc_acc;
                    test_results[cognitiveTestMetrics.EFFECT_RT] = inc_rt - con_rt;
                }
                else if (test === cognitiveTests.TASK_SWITCHING){
                     let repeat_acc = jsPsych.data.get().filter({trial_category: test, stimulus_type: 'repeat'}).select('correct').mean();
                     let switch_acc = jsPsych.data.get().filter({trial_category: test, stimulus_type: 'switch'}).select('correct').mean();
                     test_results[cognitiveTestMetrics.EFFECT_ACCURACY] = repeat_acc - switch_acc;
                     let repeat_rt = jsPsych.data.get().filter({trial_category: test, stimulus_type: 'repeat'}).select('rt').mean();
                     let switch_rt = jsPsych.data.get().filter({trial_category: test, stimulus_type: 'switch'}).select('rt').mean();
                     test_results[cognitiveTestMetrics.EFFECT_RT] = switch_rt - repeat_rt;
                }
                else if (test === cognitiveTests.POINTING){
                    let trails  = [501,502,503,504,505];
                    let acc_sum = 0;

                    for (let t =0;t<trails.length;t++){
                        let err_sum = jsPsych.data.get().filter({trial_category: test,unique_trial_id:trails[t]}).select('is_error').values.map(Number).reduce((a,b) => a + b, 0);
                        let acc = Math.max((1.0-err_sum/3.0), 0);
                        console.log(acc);
                        acc_sum = acc_sum + acc;
                    }
                    test_results[cognitiveTestMetrics.ACCURACY] = acc_sum/5;
                }

                results[test] = test_results;
            }

            console.log(results);

            $.ajax({
                type: "POST",
                url: '/workertasks/taskselection?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId,
                data: {
                    'data': JSON.stringify({
                        'summary' : results,
                        //'csv' : jsPsych.data.get().csv(),
                    }),
                    'csrfmiddlewaretoken': WINDOW_CSRF_TOKEN
                },
                success : function (response) {
                    console.log(response);
                    let recommendedTasks = '';
                    if (Array.isArray(response.recommendedTasks)){
                        recommendedTasks = '['+response.recommendedTasks.join(',')+']'
                    } else {
                        recommendedTasks = response.recommendedTasks
                    }
                    window.location.replace('/workertasks/taskselection?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId + '&recommendedTasks=' + recommendedTasks);
                },
                dataType: 'json'
            });
        }
    });
} else {
    window.location.replace('/workertasks/taskselection?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId );
}