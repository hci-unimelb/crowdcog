from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('consent', views.consent, name='consent'),
    path('cognitivetests', views.cognitivetests, name='cognitivetests'),
    path('taskselection', views.taskselection, name='taskselection'),
    path('exp', views.exp, name='exp'),
    path('complete', views.complete, name='complete')
]