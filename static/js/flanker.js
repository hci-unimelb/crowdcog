function flanker() {

    /* experiment parameters */
    var reps_per_trial_type = 4;

    /*set up instructions block*/
    var instructions = {
        type: "html-keyboard-response",
        stimulus: "<p><strong>Instructions</strong></p><p>In this task, you will see five arrows on the screen, like the example below.</p>" +
        "<img src='/static/images/flanker/inc1.png'/>" +
        "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
        "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
        "<p>Press the right arrow key to start</p>",
        post_trial_gap: 500,
        choices: [39],
        data: {trial_category: 'instructions', unique_trial_id: 290}
    };

    /*defining stimuli*/
    var test_stimuli = [
        {
            stimulus: "/static/images/flanker/con1.png",
            data: {stimulus_type: 'congruent', direction: 'left', trial_category: 'flanker', unique_trial_id: 201}
        },
        {
            stimulus: "/static/images/flanker/con2.png",
            data: {stimulus_type: 'congruent', direction: 'right', trial_category: 'flanker', unique_trial_id: 202}
        },
        {
            stimulus: "/static/images/flanker/inc1.png",
            data: {stimulus_type: 'incongruent', direction: 'right', trial_category: 'flanker', unique_trial_id: 203}
        },
        {
            stimulus: "/static/images/flanker/inc2.png",
            data: {stimulus_type: 'incongruent', direction: 'left', trial_category: 'flanker', unique_trial_id: 204}
        }
    ];

    var test = {
        timeline: [{
            type: 'image-keyboard-response',
            choices: [37, 39],
            trial_duration: 3500,
            stimulus: jsPsych.timelineVariable('stimulus'),
            data: jsPsych.timelineVariable('data'),
            on_finish: function (data) {
                var correct = false;
                if (data.direction == 'left' && data.key_press == 37 && data.rt > -1) {
                    correct = true;
                } else if (data.direction == 'right' && data.key_press == 39 && data.rt > -1) {
                    correct = true;
                }
                data.correct = correct;

                var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                jsPsych.setProgressBar(progress_bar_width*0.01+(0.4/16));
            },
            post_trial_gap: function () {
                return Math.floor(Math.random() * 500) + 500;
            }
        }],
        timeline_variables: test_stimuli,
        sample: {type: 'fixed-repetitions', size: reps_per_trial_type}
    };

    var timeline = [];
    timeline.push(instructions);
    timeline.push(test);

    return timeline;

}