# Publish a HIT to Mturk

import boto3

ASSIGNMENTS_PER_HIT = 30
NUMBER_OF_HITS = 20

MTURK_SANDBOX = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'

mturk = boto3.client('mturk',
                     aws_access_key_id="",
                     aws_secret_access_key="",
                     region_name='us-east-1',
                     endpoint_url=MTURK_SANDBOX
                     )

print("I have $" + mturk.get_account_balance()['AvailableBalance'] + " in my Sandbox account")

question = open(file='landing.xml', mode='r').read()

new_hit_type = mturk.create_hit_type(
    Title='A study that contains five simple tasks and cognitive tests',
    Description='HIT contains five simple tasks (Classification, Counting, Senitiment Analysis, Proofreading and Transcription). Based on the availalbility you will be able to select one type and answer 3 questions in each HIT. In addition to the tasks, you will also be asked to complete cognitive tests.'
                'For each completed cognitive test you will get a Bonus Payment of $ 0.30',
    Keywords='classification, counting, sentiment, proofreading, transcription',
    Reward='0.4',
    AssignmentDurationInSeconds=600,
    AutoApprovalDelayInSeconds=14400,
)

hit_type_id = new_hit_type['HITTypeId']

for h in range(NUMBER_OF_HITS):

    new_hit = mturk.create_hit_with_hit_type(
        HITTypeId=hit_type_id,
        MaxAssignments=ASSIGNMENTS_PER_HIT,
        LifetimeInSeconds=172800,
        Question=question,
    )
    print("HIT_ID = " + new_hit['HIT']['HITId'])

print("A new HITs has been created. You can preview it here:")
print("https://workersandbox.mturk.com/mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'])


# Remember to modify the URL above when you're publishing
# HITs to the live marketplace.
# Use: https://worker.mturk.com/mturk/preview?groupId=
