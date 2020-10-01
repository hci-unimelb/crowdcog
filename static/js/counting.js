function counting(tasks = [2,3,5]) {

    var timeline = [];

    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p>" +
        "<p>In this task you need to count malaria-infected blood cells on images of a petri dish using following guidelines.</p>" +
        "<div style='max-width: 80%; text-align: left; margin-left: 20%'><div><img src='/static/images/counting/sample-1.jpg'/> Blood cell: <strong>IGNORE</strong> these.</div> "+
        "<div><img src='/static/images/counting/sample-2.jpg'/> Malaria parasite in ring-form with double chromatin dots: <strong>COUNT</strong> these. </div>"+
        "<div><img src='/static/images/counting/sample-3.jpg'/> Malaria parasite in other growth stage: <strong>IGNORE</strong> these.</div></div>",
        choices: ['Continue'],
        data: {trial_category: 'instructions', unique_trial_id: 1190}
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
    };

    timeline.push(instructions_block);

    let images = [1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30, 35];
    let correct_responses = [2, 3, 4, 5, 6, 6, 11, 9, 18, 13, 24, 16];

    tasks = jsPsych.randomization.shuffle(tasks);

    for (var j = 0; j < tasks.length ; j++) {
        let i = tasks[j] - 1;
        timeline.push({
            type: 'html-text',
            preamble: '<img style="max-width: 80%" src="/static/images/counting/' + images[i] + '.jpg" />',
            prompt: 'Number of cells?',
            inputhtml: '<input type="number" min="1" max="999" name="#jspsych-survey-text-response"  autofocus />',
            data: {trial_category: 'counting', correct_response: correct_responses[i], unique_trial_id: 1101+i},
            on_finish: function (data) {
                data.correct = data.response == data.correct_response;

                // var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                // jsPsych.setProgressBar(progress_bar_width*0.01+(0.1/8));
            }
        });
    }

    return timeline;
}