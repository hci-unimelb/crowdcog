function stroop() {

    /* load psiturk */
// var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

    var timeline = [];


    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p><p>In this experiment, a word will appear in the center " +
        "of the screen.</p><p>When the word appears respond with the <strong>color</strong> " +
        "in which the word is printed as quickly as you can.</p><p> press <strong>R</strong> " +
        "for red, <strong>G</strong> for green, and <strong>B</strong> for blue.</p>" +
        "<p>Next you will see an example.</p>",
        choices: ['Continue'],
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
        data: {trial_category: 'instructions', unique_trial_id: 190}
    };

    timeline.push(instructions_block);

    var instructions_block2 = {
        type: "html-keyboard-response",
        stimulus: "<p><strong>Example</strong></p> <p> </p>" +
        "<p style='font-size: 70px; color: red; line-height: 70px'>BLUE</p> <p> </p>" +
        "<p>Here you need to press <strong>R</strong> for red which is the color of the given word." +
        "<p>Press R to begin.</p>",
        post_trial_gap: 1000,
        choices: ['r'],
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
        data: {trial_category: 'example', unique_trial_id: 191}
    };

    timeline.push(instructions_block2);

    /* stimuli specifications */

    var trials = [
        {
            stimulus: "<p style='font-size: 70px; color: red;'>SHIP</p>",
            data: {word: 'SHIP', color: 'red', stimulus_type: 'unrelated', correct_response: 'R', unique_trial_id:101, trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: green;'>MONKEY</p>",
            data: {word: 'MONKEY', color: 'green', stimulus_type: 'unrelated', correct_response: 'G', unique_trial_id:102,trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: blue;'>ZAMBONI</p>",
            data: {word: 'ZAMBONI', color: 'blue', stimulus_type: 'unrelated', correct_response: 'B', unique_trial_id:103, trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: red;'>RED</p>",
            data: {word: 'RED', color: 'red', stimulus_type: 'congruent', correct_response: 'R', unique_trial_id:104, trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: green;'>GREEN</p>",
            data: {word: 'GREEN', color: 'green', stimulus_type: 'congruent', correct_response: 'G', unique_trial_id:105, trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: blue;'>BLUE</p>",
            data: {word: 'BLUE', color: 'blue', stimulus_type: 'congruent', correct_response: 'B', unique_trial_id:106, trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: red;'>GREEN</p>",
            data: {word: 'GREEN', color: 'red', stimulus_type: 'incongruent', correct_response: 'R', unique_trial_id:107, trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: green;'>BLUE</p>",
            data: {word: 'BLUE', color: 'green', stimulus_type: 'incongruent', correct_response: 'G', unique_trial_id:108, trial_category: 'stroop'}
        },
        {
            stimulus: "<p style='font-size: 70px; color: blue;'>RED</p>",
            data: {word: 'RED', color: 'blue', stimulus_type: 'incongruent', correct_response: 'B', unique_trial_id:109, trial_category: 'stroop'}
        }
    ];

    var fixation = {
        type: 'html-keyboard-response',
        stimulus: '<p style="font-size: 50px;">+</p>',
        choices: jsPsych.NO_KEYS,
        trial_duration: 300,
        is_html: true,
        data: {stimulus_type: 'fixation'}
    };

    var word = {
        type: 'html-keyboard-response',
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['r', 'g', 'b'],
        trial_duration: 3500,
        is_html: true,
        data: jsPsych.timelineVariable('data'),
        on_finish: function (d) {
            d.correct = d.key_press == d.correct_response.charCodeAt(0);

            var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
            jsPsych.setProgressBar(progress_bar_width*0.01+(0.4/18));

        }
    };

    var test_procedure = {
        timeline: [fixation, word],
        timeline_variables: trials,
        sample: {type: 'fixed-repetitions', size: 2}
    };
    timeline.push(test_procedure);

    var summary = {
        type: 'html-keyboard-response',
        stimulus: function () {
            var congruent_rt = jsPsych.data.get().filter({stimulus_type: 'congruent'}).select('rt').mean();
            var incongruent_rt = jsPsych.data.get().filter({stimulus_type: 'incongruent'}).select('rt').mean();
            var unrelated_rt = jsPsych.data.get().filter({stimulus_type: 'unrelated'}).select('rt').mean();
            var congruent_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'congruent'}).select('correct').mean();
            var incongruent_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'incongruent'}).select('correct').mean();
            var unrelated_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'unrelated'}).select('correct').mean();
            return '<p>Your average response time on congruent trials was ' + Math.round(congruent_rt) + 'ms. ' +
                'Your average response time on incongruent trials was ' + Math.round(incongruent_rt) + 'ms. ' +
                'Your average response time on unrelated trials was ' + Math.round(unrelated_rt) + 'ms.</p>' +
                '<p>Your average percent correct on congruent trials was ' + Math.round(congruent_pct) + '%. ' +
                'Your average percent correct on incongruent trials was ' + Math.round(incongruent_pct) + '%. ' +
                'Your average percent correct on unrelated trials was ' + Math.round(unrelated_pct) + '%.</p>' +
                '<p>Thanks for participating! Press "q" to finish the experiment.</p>';
        },
        choices: ['q'],
        is_html: true
    };

    return timeline;

}
