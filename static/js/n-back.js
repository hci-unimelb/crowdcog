function nBack() {

    var timeline = [];

    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p>" +
        "<p>In this test, you will see a sequence of letters. Each letter is shown for few seconds. </p>" +
        "<p>You need to decide if you saw the same letter 3 trials ago and press <strong>Y</strong> for yes or <strong>N</strong> for no.</p>" +
        "<p>For each response, you will get feedback with a green indicator for correct or red for incorrect.</p>" +
        "<p>Start responding from the third letter onwards. Press any key to start the test.</p>",
        post_trial_gap: 500,
        choices: ['Continue'],
        data: {trial_category: 'instructions', unique_trial_id: 390}
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
    };

    timeline.push(instructions_block);

    var pre_trials = {
        timeline: [
            {
                type: 'html-keyboard-response',
                stimulus: function () {
                    return "<div class='n-back-container'><div class=n-back-box>" + jsPsych.timelineVariable('letter', true) + "</div><div class='n-back-indicator'></div></div>";
                },
                choices: jsPsych.NO_KEYS,
                trial_duration: 2000,
                post_trial_gap: 300,
                data: jsPsych.timelineVariable('data')
            }
        ],
        timeline_variables: [
            {letter: 'L', answer: 'n' },
            {letter: 'F', answer: 'n' },
            {letter: 'G', answer: 'n' }
        ]
    };

    timeline.push(pre_trials);

    var trials = {
        timeline: [
            {
                type: 'html-keyboard-response',
                stimulus: function () {
                    return "<div class='n-back-container'><div class=n-back-box>" + jsPsych.timelineVariable('letter', true) + "</div><div class='n-back-indicator'></div></div>";
                },
                choices: ['y', 'n'],
                trial_duration: 3500,
                on_finish: function (data) {
                    var correct = false;
                    if (data.key_press === jsPsych.pluginAPI.convertKeyCharacterToKeyCode(jsPsych.timelineVariable('answer', true))) {
                        correct = true;
                    }
                    data.correct = correct;

                    var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                    jsPsych.setProgressBar(progress_bar_width*0.01+(0.4/16));
                },
                data: jsPsych.timelineVariable('data')
            },
            {
                type: 'html-keyboard-response',
                stimulus: function () {
                    var data = jsPsych.data.get().last(1).values()[0];
                    if (data.key_press == null) {
                        return "";
                    } else if (data.key_press === jsPsych.pluginAPI.convertKeyCharacterToKeyCode(jsPsych.timelineVariable('answer', true))) {
                        return "<div class='n-back-container'><div class=n-back-box>" + jsPsych.timelineVariable('letter', true) +
                            "</div><div class='n-back-indicator n-back-indicator-correct'></div></div>";
                    } else {
                        return "<div class='n-back-container'><div class=n-back-box>" + jsPsych.timelineVariable('letter', true) +
                            "</div><div class='n-back-indicator n-back-indicator-wrong'></div></div>";
                    }

                },
                choices: jsPsych.NO_KEYS,
                trial_duration: 300
            }
        ],
        timeline_variables: [
            {letter: 'K', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:301}},
            {letter: 'F', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:302}},
            {letter: 'L', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:303}},
            {letter: 'K', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:304}},
            {letter: 'M', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:305}},
            {letter: 'F', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:306}},
            {letter: 'K', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:307}},
            {letter: 'M', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:308}},
            {letter: 'M', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:309}},
            {letter: 'F', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:310}},
            {letter: 'M', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:311}},
            {letter: 'L', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:312}},
            {letter: 'K', answer: 'n', data: {trial_category: 'n-back',unique_trial_id:313}},
            {letter: 'M', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:314}},
            {letter: 'L', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:315}},
            {letter: 'K', answer: 'y', data: {trial_category: 'n-back',unique_trial_id:316}}
        ]
    };

    timeline.push(trials);

    return timeline;

}
