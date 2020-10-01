
jsPsych.plugins['html-text'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-text',
    description: '',
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: undefined,
        description: 'Prompt for the subject to response'
      },
      value: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Value',
        default: "",
        description: 'The string will be used to populate the response field with editable answer.'
      },
      inputhtml: {
          type : jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Input HTML',
          default: null,
          description: 'HTML formatted string for the input field.'
      },
      rows: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Rows',
        default: 1,
        description: 'The number of rows for the response text box.'
      },
      columns: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Columns',
        default: 40,
        description: 'The number of columns for the response text box.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      },
        enterKey: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Enter to Submit',
            default:  true,
            description: 'Pressing enter will submit.'
        },
    }
  };

  plugin.trial = function(display_element, trial) {

    if (typeof trial.rows == 'undefined') {
        trial.rows = 1;
    }
    if (typeof trial.columns == 'undefined') {
        trial.columns = 40;
    }

    if (typeof trial.value == 'undefined') {
      trial.value = "";
    }


    var html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble">'+trial.preamble+'</div>';
    }
    // add questions
    html += '<div id="jspsych-survey-text" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
    html += '<p class="jspsych-survey-text">' + trial.prompt + '</p>';
    if(trial.inputhtml == null){
        if(trial.rows == 1){
          html += '<input type="text" name="#jspsych-survey-text-response" size="'+trial.columns+'" value="'+trial.value+'" autofocus ></input>';
        } else {
          html += '<textarea name="#jspsych-survey-text-response" cols="' + trial.columns + '" rows="' + trial.rows + '" autofocus >'+trial.value+'</textarea>';
        }
    } else {
        html += trial.inputhtml
    }
    html += '</div>';


    // add submit button
    html += '<button id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text">'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    function endTrial(){
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        // create object to hold responses
        var question_data = {};
        var matches = display_element.querySelectorAll('div.jspsych-survey-text-question');
        var answer = matches[0].querySelector('textarea, input').value;

        // save data
        var trialdata = {
            "rt": response_time,
            "response": answer
        };

        display_element.innerHTML = '';

        // next trial
        jsPsych.finishTrial(trialdata);
    }

    display_element.querySelector('#jspsych-survey-text-next').addEventListener('click', function() {
        endTrial();
    });

    if(trial.enterKey == true) {
        display_element.querySelectorAll('div.jspsych-survey-text-question')[0].querySelector('textarea, input').addEventListener('keydown', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                endTrial();
            }
        });
    }

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
