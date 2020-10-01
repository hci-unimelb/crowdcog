import random
from workertasks.models import Worker, Question
import json
import copy

from math import log


def entropy(drb):
    eps = 1e-7
    answer = 0
    for x in drb:
        answer = answer - x * log(x + eps)
    return answer


def assign_qasca(questions, numberOfQuestions, workerQuality):
    #
    quality = workerQuality
    etpList = []
    for x in range(len(questions)):
        dis = json.loads(questions[x].distribution)
        etp = entropy(dis)
        l = len(dis)
        sample = random.random()
        for t in range(l):
            delta = dis[t] * quality + (1.0 - dis[t]) * (1 - quality) / (l - 1)
            sample = sample - dis[t]
            disTemp = []
            if (sample < 1e-7):
                for j in range(l):
                    if (t != j):
                        disTemp.append(dis[j] * (1.0 - quality) / (l - 1) / delta)
                    else:
                        disTemp.append(dis[j] * quality / delta)
                etp = etp - entropy(disTemp)
                break
        etpList.append((x, etp))
    etpList = sorted(etpList, key=lambda x: x[1], reverse=True)
    res = [questions[etpList[x][0]] for x in range(numberOfQuestions)]
    return res


def complete_qasca(question_completion_instance_list):
    resList = []
    workerQualityDict = {}
    for instance in question_completion_instance_list:
        print(instance)
        resList.append([instance.question_id, instance.worker_id, instance.answer])
        worker = Worker.objects.get(worker_uid=instance.worker_id)
        workerQualityDict[worker.worker_uid] = worker.quality

        question = Question.objects.get(question_uid=instance.question_id)
        dis = json.loads(question.distribution)
        quality = worker.quality
        answer = int(instance.answer)
        delta = dis[answer] * quality + (1.0 - dis[answer]) * (1.0 - quality) / (len(dis) - 1)
        for i in range(len(dis)):
            if i != answer:
                dis[i] = dis[i] * (1.0 - quality) / (len(dis) - 1) / delta
            else:
                dis[i] = dis[i] * quality / delta
        question.distribution = json.dumps(dis)
        question.save()

    print(workerQualityDict)
    from workertasks.assignment.em_main import infer
    res, workerQualityDict = infer(resList, workerQualityDict)
    print(res)
    print(workerQualityDict)

    # for x in res:
    #     task = TaskInfo.objects.get(taskId=x)
    #     task.result=res[x]
    #     task.save()
    for workerId in workerQualityDict:
        worker = Worker.objects.get(worker_uid=workerId)
        worker.quality = workerQualityDict[workerId]
        worker.save()
        print(workerId,workerQualityDict[workerId])


