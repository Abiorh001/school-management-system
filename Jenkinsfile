pipeline {
    agent {
        kubernetes {
            inheritFrom 'kube-agent' 
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: jenkins
spec:
  containers:
    - name: python
      image: python:3.8
      command:
        - cat
      tty: true
"""
        }
    }
    tools {
        sonarscanner 'SonarScanner'
    }
    environment {
        SONAR_HOST_URL = 'http://192.168.1.185:30942'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing Python dependencies"
                pip install -r requirements.txt
                '''
            }
        }
        stage('Code Analysis') {
            steps {
                withCredentials([string(credentialsId: 'SonarQube', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    sonar-scanner \
                        -Dsonar.projectKey=school_management_system \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
        }
    }
}
