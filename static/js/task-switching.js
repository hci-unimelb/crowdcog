function taskSwitching() {
    var timeline = [];

    function createElement(text, position) {
        var element = '<div class="task-switching-box-container">';
        for (var k = 0; k < 4; k++) {
            element += '<div class="task-switching-box">';
            if (k == position) element += text;
            element += '</div>';
        }
        element += '</div>';
        return element;
    }

    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p><p>In this test, you will see four boxes and a <strong>letter/number</strong> combination, such as <strong>K2</strong> on one of the boxes." +
        "<p>If it appear on the top two boxes, you need to quickly respond to the letter and press <strong>Y</strong> if the letter is constant (G,H,J,K) or press <strong>N</strong> if it is a vowel (A,E,I,O)" +
        "<p>if it appear on the bottom two boxes, you need to respond to the number and press <strong>Y</strong> if the letter is odd (1,3,5,7) or press <strong>N</strong> if it is even (2,4,6,8) </p>" +
        "<p>Next, you will see an example.</p>",
        choices: ['Continue'],
        data: {trial_category: 'instructions', unique_trial_id: 490}
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
    };

    timeline.push(instructions_block);

    var instructions_block2 = {
        type: "html-keyboard-response",
        stimulus: "<p><strong>Example</strong></p>" + createElement('K 2', 3) + "<p>Since it appear on the bottom, you need to consider the number and press <strong>N</strong> since 2 is even.</p>" +
        "<p>Press N to begin</p>",
        post_trial_gap: 500,
        choices: ['n'],
        data: {trial_category: 'example', unique_trial_id: 491}
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
    };

    timeline.push(instructions_block2);


    var trials = [
        {stimulus: createElement('O 3', 3), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'initial',unique_trial_id: 401}},
        {stimulus: createElement('K 8', 2), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 402}},
        {stimulus: createElement('J 6', 1), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 403}},
        {stimulus: createElement('G 6', 0), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 404}},
        {stimulus: createElement('O 1', 0), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 405}},
        {stimulus: createElement('J 2', 2), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 406}},
        {stimulus: createElement('K 2', 1), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 407}},
        {stimulus: createElement('G 6', 3), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 408}},
        {stimulus: createElement('I 1', 3), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 409}},
        {stimulus: createElement('A 7', 2), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 410}},
        {stimulus: createElement('H 4', 2), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 411}},
        {stimulus: createElement('I 3', 1), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 412}},
        {stimulus: createElement('H 8', 0), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 413}},
        {stimulus: createElement('E 5', 3), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 414}},
        {stimulus: createElement('E 3', 0), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 415}},
        {stimulus: createElement('A 7', 1), correct_response: 'n', data: {trial_category:'task-switching',stimulus_type: 'repeat',unique_trial_id: 416}},
        {stimulus: createElement('O 3', 3), correct_response: 'y', data: {trial_category:'task-switching',stimulus_type: 'switch',unique_trial_id: 417}},
    ];

    timeline.push({
        timeline: [{
            type: 'html-keyboard-response',
            choices: ['y', 'n'],
            stimulus: jsPsych.timelineVariable('stimulus'),
            prompt: "<p>press <strong>Y</strong> for odd or <strong>N</strong> for even or <strong>Y</strong> for constant or <strong>N</strong> for vowel</p>",
            trial_duration: 3500,
            post_trial_gap: 500,
            on_finish: function (data) {
                var correct = false;
                if (data.key_press === jsPsych.pluginAPI.convertKeyCharacterToKeyCode(jsPsych.timelineVariable('correct_response', true))) {
                    correct = true;
                }
                data.correct = correct;

                var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                jsPsych.setProgressBar(progress_bar_width*0.01+(0.4/17));
            },
            data: jsPsych.timelineVariable('data')
        }],
        timeline_variables: trials
    });


    return timeline;

}