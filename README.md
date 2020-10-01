## CrowdCog: A Cognitive Skill based System for Heterogeneous Task Assignment and Recommendation in Crowdsourcing

Source code for the prototype framework built for our study on using cognitive skills for heterogeneous task assignment and recommendation in crowdsourcing.
If you use our work in your research, please cite the following paper published at CSCW 2020.

> Danula Hettiachchi, Niels van Berkel, Vassilis Kostakos, and Jorge Goncalves. 2020. CrowdCog: A Cognitive Skill based System for Heterogeneous Task Assignment and Recommendation in Crowdsourcing. Proc. ACM Hum.-Comput. Interact. 4, CSCW2, Article 110 (October 2020), 22 pages. https://doi.org/10.1145/3415181



The current implementation includes five cognitive tests (Stroop, Flanker, Task Switching, N-Back and Self-ordered Pointing) and four crowdsourcing tasks (Classification, Counting, Transcription, and Sentiment Analysis). Please refer to the paper for more details including deployment conditions.

### Deployment Guide

- MySQL
`sudo apt-get install mysql-server`
- Venv

Create a new virtual environment at the project root
`virtualenv -p python3 cognitive`

Activate the virtual environment
`source cognitive/bin/activate`

Install dependencies
`pip install django`
`pip install mysqlclient`

Launch Django console
`python manage.py shell`

Build models for cognitive tests in django console
`exec(open('workertasks/assignment/build_cognitive_model.py').read())`

Create data in django console
`exec(open('workertasks/initialize_data.py').read())`

Check if the server is running
`python manage.py runserver`

Install the following

- Apache2
- Apache2 Mod WSGI

Create a new configuration named `cognitive.conf` at `/apache2/sites-available` with content from `apache-site-cognitive.conf` in project root

Enable the site
`sudo a2ensite cognitive.conf`

Reload apache config
`sudo systemctl reload apache2`

### Contact

Please feel free to contact Danula Hettiachchi (contact@danulahettiachchi.com) for further questions.

- <a href='https://www.danulahettiachchi.com'>Danula Hettiachchi</a>
- <a href='https://www.nielsvanberkel.com'>Niels van Berkel</a>
- <a href='https://www.jorgegoncalves.com'>Jorge Goncalves</a>
- <a href='https://people.eng.unimelb.edu.au/vkostakos/'>Vassilis Kostakos</a>