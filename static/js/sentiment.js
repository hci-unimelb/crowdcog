function sentiment(tasks = [2,3,5]) {

    var timeline = [];

    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p>" +
        "<p>In this task, you need to identify the sentiment of a sentence (i.e., point of view, opinion). " +
        "A sentence’s sentiment will be classified as either <strong>‘negative’, ‘neutral’,</strong> or <strong>‘positive’</strong> .</p>" +
        "<p>Click the relevant button to provide your answer</p>",
        post_trial_gap: 500,
        choices: ['Start'],
        data: {trial_category: 'instructions', unique_trial_id: 1390}
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
    };

    timeline.push(instructions_block);

    var trials_all = [
        {
            stimulus: "<p>My internet provider does a great job when it comes to stealing money from me</p><br>",
            data: {unique_trial_id: 1301, correct_response: 2, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>The only downside of this restaurant is that it charges me too little for its service.</p><br>",
            data: {unique_trial_id: 1302, correct_response: 0, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>Can you recommend a good tool I could use?</p><br>",
            data: {unique_trial_id: 1303, correct_response: 1, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>This browser uses a lot of memory.</p><br>",
            data: {unique_trial_id: 1304, correct_response: 2, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>Absolutely adore it when my bus is late.</p><br>",
            data: {unique_trial_id: 1305, correct_response: 2, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>I’m so pleased road construction woke me up with a bang.</p><br>",
            data: {unique_trial_id: 1306, correct_response: 2, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>The new album is so sick.</p><br>",
            data: {unique_trial_id: 1307, correct_response: 0, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>That was such a wicked performance by him at the concert.</p><br>",
            data: {unique_trial_id: 1308, correct_response: 0, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>The weather is great today!</p><br>",
            data: {unique_trial_id: 1309, correct_response: 0, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>The lecture was very informative.</p><br>",
            data: {unique_trial_id: 1310, correct_response: 0, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>My friends think the price is too expensive.</p><br>",
            data: {unique_trial_id: 1311, correct_response: 2, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>I’m loving it so far.</p><br>",
            data: {unique_trial_id: 1312, correct_response: 0, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>I’ve just finished my work.</p><br>",
            data: {unique_trial_id: 1313, correct_response: 1, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>He’s been useless to the team so far.</p><br>",
            data: {unique_trial_id: 1314, correct_response: 2, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>I hate it when she acts like that.</p><br>",
            data: {unique_trial_id: 1315, correct_response: 2, trial_category: 'sentiment'}
        },
        {
            stimulus: "<p>The keys are on the table.</p><br>",
            data: {unique_trial_id: 1316, correct_response: 1, trial_category: 'sentiment'}
        }
    ];

    let trials = [];

    tasks = jsPsych.randomization.shuffle(tasks);

    for (var j = 0; j < tasks.length; j++) {
        trials.push(trials_all[tasks[j]-1]);
    }


    timeline.push({
            timeline: [{
                type: 'html-button-response',
                choices: ['Positve', 'Neutral', 'Negative'],
                // button_html: ['<button class="jspsych-btn jspsych-btn-green" >%choice%</button>',
                //     '<button class="jspsych-btn" >%choice%</button>',
                //     '<button class="jspsych-btn jspsych-btn-red" >%choice%</button>',
                // ],
                // prompt: "<p>What color is this word?</p>",
                stimulus: jsPsych.timelineVariable('stimulus'),
                data: jsPsych.timelineVariable('data'),
                on_finish: function (d) {
                    d.correct = d.button_pressed == d.correct_response;

                    // var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                    // jsPsych.setProgressBar(progress_bar_width*0.01+(0.1/16));
                }
            }],
            timeline_variables: trials,
            randomize_order: true,
        }
    );

    return timeline;

}
