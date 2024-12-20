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
    environment {
        SONAR_HOST_URL = 'http://192.168.1.185:30942'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                container('python') {
                    sh '''
                    echo "Installing Python dependencies"
                    pip install -r requirements.txt
                    '''
                }
            }
        }
        stage('Install SonarScanner') {
            steps {
                container('python') {
                    sh '''
                    apt-get update && apt-get install -y wget unzip
                    wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
                    unzip sonar-scanner-cli-4.8.0.2856-linux.zip -d /opt
                    mv /opt/sonar-scanner-* /opt/sonar-scanner
                    ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner
                    '''
                }
            }
        }
        stage('Code Analysis') {
            steps {
                container('python') {
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
}
