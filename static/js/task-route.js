let timeline = [];
let newTimeline = [];


if (condition === conditions.BASELINE || condition === conditions.QASCA || condition === conditions.CROWD_DQS) {
    // Add the task selection to the timeline
    let taskOptions = [
                    crowdTasks.LABELS.CLASSIFICATION,
                    crowdTasks.LABELS.COUNTING,
                    crowdTasks.LABELS.PROOFREADING,
                    crowdTasks.LABELS.SENTIMENT,
                    crowdTasks.LABELS.TRANSCRIPTION
                ];


    availableTasks = availableTasks.map(x => parseInt(x)).sort((a, b) => a - b);

    let choices = [];
    for (let p in availableTasks){
        choices.push(taskOptions[availableTasks[p]-1]);
    }


    let taskSelection = {
        type: "html-button-response",
        stimulus: "Select the task",
        margin_vertical: '8px',
        choices: choices,
    };
    timeline.push(taskSelection);

    jsPsych.init({
        timeline: timeline,
        on_finish: function (data) {
            let selection = choices[jsPsych.data.get().select('button_pressed').values[0]].toLowerCase();
            window.location.replace('/workertasks/exp?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId + '&task=' + selection);
        }
    });
} else if (condition === conditions.COGNITIVE_ASSIGN || condition === conditions.COGNITIVE_RECOMMEND) {

            if (condition === conditions.COGNITIVE_RECOMMEND) {
                // Recommend Tasks based on cognitive tests

                let taskOptions = [
                    crowdTasks.LABELS.CLASSIFICATION,
                    crowdTasks.LABELS.COUNTING,
                    crowdTasks.LABELS.PROOFREADING,
                    crowdTasks.LABELS.SENTIMENT,
                    crowdTasks.LABELS.TRANSCRIPTION
                ];


                availableTasks = availableTasks.map(x => parseInt(x)).sort((a, b) => a - b);
                if(Array.isArray(recommendedTasks)) {
                    recommendedTasks.sort((a, b) => a - b);
                }
                let choices = [];
                let buttonHtml = [];
                for (let p in availableTasks){
                    choices.push(taskOptions[availableTasks[p]-1]);
                    if(Array.isArray(recommendedTasks)){
                        if(recommendedTasks.includes(availableTasks[p])){
                            buttonHtml.push('<button class="jspsych-btn jspsych-btn-green">%choice%</button>')
                        } else {
                            buttonHtml.push('<button class="jspsych-btn">%choice%</button>');
                        }
                    } else {
                        buttonHtml.push('<button class="jspsych-btn">%choice%</button>');
                    }
                }
                // buttonHtml[choices.indexOf(recommendedTask)] = '<button class="jspsych-btn jspsych-btn-green">%choice%</button>';

                console.log(choices);
                console.log(buttonHtml);

                let taskSelection = {
                    type: "html-button-response",
                    stimulus: "Select the task",
                    margin_vertical: '8px',
                    choices: choices,
                    button_html: buttonHtml,
                    prompt: "Tasks recommended based on cognitive tests are highlighted in green colour."
                };

                jsPsych.init({
                    timeline: [taskSelection],
                    show_progress_bar: true,
                    on_finish: function (data) {
                        var selection = choices[jsPsych.data.get().select('button_pressed').values[0]].toLowerCase();
                        window.location.replace('/workertasks/exp?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId + '&task=' + selection);
                    }
                })

            } else {
                window.location.replace('/workertasks/exp?hitId=' + hitId + '&assignmentId=' + assignmentId + '&workerId=' + workerId +'&task=' + crowdTaskMapping[recommendedTasks[0]]);
            }
}






