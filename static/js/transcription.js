function transcription(tasks = [2,3,5]) {

    var timeline = [];

    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p>" +
        "<p>In this task you will see images extracted from George Washington Papers at Manuscript Division of the Library of Congress.</p>" +
        "<p>Each image contain a line or two of writings. You need to type the exact text shown in the image. <br>Some are incomplete sentences.</p>" +
        "<p>Next, you will see an example.</p>",
        choices: ['Continue'],
        data: {trial_category: 'instructions', unique_trial_id: 1590}
        // on_finish: function(){
        //     psiturk.finishInstructions();
        // }
    };

    timeline.push(instructions_block);

    var example_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Example</strong></p>" +
        '<img style="width: 100%;" src="/static/images/transcription/example.jpg" /><p></p>' +
        '<textarea cols="100" rows="2" name="#jspsych-survey-text-response"  disabled>' +
        'The several subjects, to which I have now referred, open a wide range to your</textarea>',
        choices: ['Start'],
        data: {trial_category: 'example', unique_trial_id: 1591}
    };

    timeline.push(example_block);


    var trials = [];

    tasks = jsPsych.randomization.shuffle(tasks);

    for (var j=0; j<tasks.length; j++){
        var i = tasks[j];
        trials.push({
            image: i,
            data: { trial_category: 'transcription', unique_trial_id: 1500+i }
        })
    }

    timeline.push({
        timeline: [{
            type: 'html-text',
            preamble: function () {
                return '<img style="width: 100%;" src="/static/images/transcription/'+jsPsych.timelineVariable('image',true)+'.jpg" />'
            },
            prompt: "",
            columns: 120,
            inputhtml: '<textarea cols="100" rows="2" name="#jspsych-survey-text-response"  autofocus></textarea>',
            data: jsPsych.timelineVariable('data'),
            on_finish: function (data) {
                // var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                // jsPsych.setProgressBar(progress_bar_width*0.01+(0.1/16));
            }
        }],
        timeline_variables: trials,
        enterKey: false,
        randomize_order: true
    });


jsPsych.init({
    timeline: timeline,
    on_finish: function() { jsPsych.data.displayData(); }
});

    return timeline;
}