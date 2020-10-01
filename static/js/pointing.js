function pointing() {

    var timeline_pointing = [];

    var instructions_block = {
        type: "html-button-response",
        stimulus: "<p><strong>Instructions</strong></p>" +
        "<p>In this test you have to search a set of boxes by clicking them, until you find a star (★). While searching you should not click the same box twice. " +
        "Once you find the star, it will be hidden in another box and you could repeat the search. " +
        "Stars will not appear on the same box again, therefore you need to remember where you found each star and avoid clicking those boxes.</p>" +
        "<p>When you click on a box, if the box contains a star it will turn <strong>green</strong> for a brief time and show the star. If not it will turn into either <strong>gray</strong> if its empty or " +
        "<strong>red</strong> if you have made a mistake.</p>" +
        "<p>You will see an example next</p>",

        choices: ['Continue'],
        data: {trial_category: 'instructions', unique_trial_id: 590}
    };

    timeline_pointing.push(instructions_block);

    var example_block = {
        type: "html-button-response",
        stimulus: "<img src='/static/images/pointing-example.gif'/>",
        post_trial_gap: 500,
        choices: ['Start'],
        data: {trial_category: 'example', unique_trial_id: 591}
    };

    timeline_pointing.push(example_block);


    var square_size = 50;

    function getTrial(trialId, gridSize, list) {
        list = jsPsych.randomization.shuffle(list);

        var currentTarget = 0;
        var clickedCells = [];
        var completedCells = [];
        var errors = 0;
        var is_correct ;
        var is_error;
        var rt = null;

        function getGrid() {
            var grid_rows = 5;
            var grid_cols = 5;


            var grid = [];
            var locations = [];

            for (var i = 0; i < grid_rows; i++) {
                grid.push([]);
                for (var j = 0; j < grid_cols; j++) {
                    grid[i].push(0);
                    if (i > 0 && i < grid_rows - 1 && j > 0 && j < grid_cols - 1) {
                        locations.push([i, j]);
                    }
                }
            }

            for (var p in list) {
                grid[list[p][0]][list[p][1]] = 1;
            }
            return grid;
        }

        function getNextTarget() {
            var lastResponse = jsPsych.data.get().last(1).values()[0];

            var target = list[currentTarget];

            if (lastResponse !== undefined) {
                if (!(lastResponse.response_row == list[currentTarget][0] && lastResponse.response_column == list[currentTarget][1])) {
                    target = [lastResponse.response_row, lastResponse.response_column];
                }
            }
            return target;
        }

        return {
            timeline: [
                {
                    type: 'pointing',
                    grid: getGrid,
                    target: list[currentTarget],
                    grid_square_size: square_size,
                    on_finish: function (d) {
                        is_correct = (d.response_row == list[currentTarget][0] && d.response_column == list[currentTarget][1]);
                        is_error = false;
                        if (!is_correct){
                            for (var i in clickedCells) {
                                if (d.response_row == clickedCells[i][0] && d.response_column == clickedCells[i][1]) {
                                    is_error = true;
                                }
                            }

                            for (var i in completedCells) {
                                if (d.response_row == completedCells[i][0] && d.response_column == completedCells[i][1]) {
                                    is_error = true;
                                }
                            }
                        }

                        rt = d.rt;
                    }
                },
                {
                    type: 'pointing',
                    grid: getGrid,
                    target: getNextTarget,
                    target_color: function () {
                        var lastResponse = jsPsych.data.get().last(1).values()[0];
                        var color = '#898c8d';

                        if (lastResponse !== undefined) {
                            for (var i in clickedCells) {
                                if (lastResponse.response_row == clickedCells[i][0] && lastResponse.response_column == clickedCells[i][1]) {
                                    color = '#d9534f';
                                    errors++;
                                }
                            }

                            for (var i in completedCells) {
                                if (lastResponse.response_row == completedCells[i][0] && lastResponse.response_column == completedCells[i][1]) {
                                    color = '#d9534f';
                                    errors++;
                                }
                            }

                            if (lastResponse.response_row == list[currentTarget][0] && lastResponse.response_column == list[currentTarget][1]) {
                                color = '#5cb85c';
                                clickedCells = [];
                                completedCells.push(list[currentTarget]);
                                currentTarget++;

                            } else {
                                if (color != '#d9534f') clickedCells.push([lastResponse.response_row, lastResponse.response_column])
                            }
                        }
                        return color;
                    },
                    grid_square_size: square_size,
                    // prompt: "<p>Errors: "+ errors + "</p>",
                    trial_duration: 500,
                    allow_responses: false,
                    data: { trial_category:'pointing', unique_trial_id:trialId },
                    on_finish: function (data) {
                        data.correct = is_correct;
                        data.is_error = is_error;
                        data.rt = rt;
                    }
                }
            ],
            loop_function: function () {
                return currentTarget !== list.length;
            },
        };


    }

    var trialList = [];
    trialList.push(getTrial(501, 4, [[0, 2], [1, 1], [3, 2]]));
    trialList.push(getTrial(502, 5, [[2, 0], [3, 3], [2, 2], [4, 2]]));
    trialList.push(getTrial(503, 5, [[1, 4], [1, 1], [3, 0], [4, 2], [0, 2]]));
    trialList.push(getTrial(504, 5, [[2, 3], [2, 4], [4, 2], [1, 2], [1, 0], [4, 1],[3,1]]));
    trialList.push(getTrial(505, 5, [[1, 2], [3, 3], [3, 2], [4, 0], [0, 0], [0, 3],[1, 4],[3,4]]));

    for (var t in trialList) {
        var round = t * 1 + 1;
        timeline_pointing.push({
            type: "html-keyboard-response",
            stimulus: "<p><strong>Round " + round + "</strong>",
            trial_duration: 1000,
            choices: jsPsych.NO_KEYS,
            on_load: function () {
                var progress_bar_width = $('#jspsych-progressbar-inner')[0].style.width.slice(0,-1);
                jsPsych.setProgressBar(progress_bar_width*0.01 + (0.4/6) );
            }
        });
        timeline_pointing.push(trialList[t]);
    }

    return timeline_pointing;

}