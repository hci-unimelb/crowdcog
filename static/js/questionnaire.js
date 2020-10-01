function questionnaire(){
    let timeline = [];

    timeline.push({
        type: 'html-text',
        prompt: 'What is your age?',
        inputhtml: '<input type="number" min="1" max="999" name="#jspsych-survey-text-response"  autofocus />',
        data: {trial_category: 'questionnaire',unique_trial_id:2101},
    });

    timeline.push({
        type: 'survey-multi-choice',
        preamble: "",
        questions: [{
            prompt: "What is your sex?",
            options: ['Female','Male','Other'],
            horizontal: false
        }],
        required: false,
        button_label: 'Next',
        data: { trial_category:'questionnaire',unique_trial_id:2102},
        on_finish: function (data) {
            data.response = JSON.parse(data.responses).Q0
        }
    });

    timeline.push({
        type: 'survey-multi-choice',
        preamble: "",
        questions: [{
            prompt: "What is your highest education level?",
            options: ['High School','College','Associate/Bachelors Degree','Advanced/Higher Degree'],
            horizontal: false
        }],
        required: false,
        button_label: 'Next',
        data: { trial_category:'questionnaire',unique_trial_id:2103},
        on_finish: function (data) {
            data.response = JSON.parse(data.responses).Q0
        }
    });

    return timeline;
}