function proofreading(tasks = [2,3,5]) {

    var timeline = [];

    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p>" +
        "<p>In this task you will see text. You need to identify if the given text has a mistake (misspelled word, incorrect word etc.) and <strong>type the correct word that should replace the incorrect word.</strong> " +
        "Leave the input box blank if there is no mistake.</p>",
        post_trial_gap: 500,
        choices: ['Start'],
        data: {trial_category: 'instructions', unique_trial_id: 1490}
    };

    timeline.push(instructions_block);

    var trials_all = [
        {
            prompt: "The place was not only pleasent, but perfect, if once he could regard it not as a deception but rather as a dream",
            data: { correct_response: 'pleasant', trial_category: 'proofreading', unique_trial_id: 1401}
        },
        {
            prompt: "More especially this attractive unreality fell upon it about nightfall, when the extravagant roofs were dark against the afterglow and the whole insane village seemed as seperate as a drifting cloud.",
            data: { correct_response: 'separate', trial_category: 'proofreading', unique_trial_id: 1402}
        },
        {
            prompt: "For a time the Major showed an inclination to discourage the advances of the \"play actor,\" as he privately termed him; but soon the young man's agreeable manner and indubitable appreciation of the old gentlemans stories completely won him over.",
            data: { correct_response: 'gentleman\'s', trial_category: 'proofreading', unique_trial_id: 1403}
        },
        {
            prompt: "Your mysterious young friend, who’s name you have never told me, but whose picture really fascinates me, never thinks. I feel quite sure of that.",
            data: { correct_response: 'whose', trial_category: 'proofreading', unique_trial_id: 1404}
        },
        {
            prompt: "The place stood back from the road, half hidden among the trees, though which glimpses could be caught of the wide cool veranda that ran around its four sides.",
            data: { correct_response: 'through', trial_category: 'proofreading', unique_trial_id: 1405}
        },
        {
            prompt: "Though we are not so degenerate but that we might possibly live in a cave or a wigwam or wear skins today, it certainly is better to except the advantages, though so dearly bought, which the invention and industry of mankind offer.",
            data: { correct_response: 'accept', trial_category: 'proofreading', unique_trial_id: 1406}
        },
        {
            prompt: "Well, of course the war has turned the hundreds into thousands. No doubt the fellow was very useful to here. But you could have knocked us all down with a feather when, three months ago, she suddenly announced that she and Alfred were engaged!",
            data: { correct_response: 'her', trial_category: 'proofreading', unique_trial_id: 1407}
        },
        {
            prompt: "he was keeping it in the coal-cellar with a select party of two other young gentleman, who, after participating with him in a sound thrashing, had been looked up for atrociously presuming to be hungry.",
            data: { correct_response: 'locked', trial_category: 'proofreading', unique_trial_id: 1408}
        },
        {
            prompt: "It’s physical condition is still largely a mystery, but we know now that even in its equatorial region the midday temperature barely approaches that of our coldest winter.",
            data: { correct_response: 'Its', trial_category: 'proofreading', unique_trial_id: 1409}
        },
        {
            prompt: "Holmes, who loathed every form of society with his whose Bohemian soul, remained in our lodgings in Baker Street, buried among his old books.",
            data: { correct_response: 'whole', trial_category: 'proofreading', unique_trial_id: 1410}
        },
        {
            prompt: "The studio was filled with the rich odor of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.",
            data: { correct_response: '', trial_category: 'proofreading', unique_trial_id: 1411}
        },
        {
            prompt: "Lord Henry elevated his eyebrows and looked at him in amazement through the thin blue wreaths of smoke that curled up in such fanciful whorls from his heavy, opium-tainted cigarette.",
            data: { correct_response: '', trial_category: 'proofreading', unique_trial_id: 1412}
        }
    ];


    let trials = [];

    tasks = jsPsych.randomization.shuffle(tasks);

    for (var j = 0; j < tasks.length; j++) {
        trials.push(trials_all[tasks[j]-1]);
    }

    timeline.push({
        timeline: [{
            type: 'html-text',
            prompt: jsPsych.timelineVariable('prompt'),
            columns: 20,
            inputhtml: '<input type="text" min="1" max="999" name="#jspsych-survey-text-response"  autofocus />',
            data: jsPsych.timelineVariable('data'),
            on_finish: function (data) {
                data.correct = data.response == data.correct_response;

                // var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                // jsPsych.setProgressBar(progress_bar_width*0.01+(0.1/16));
            }
        }],
        timeline_variables: trials,
        randomize_order: true
    });

    return timeline;
};