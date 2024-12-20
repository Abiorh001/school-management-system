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
      image: python:3.12
      command:
        - cat
      tty: true
    - name: sonar-scanner
      image: sonarsource/sonar-scanner-cli:11.1.1.1661_6.2.1
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
        stage('Install Python Dependencies') {
            steps {
                container('python') {
                    sh '''
                    echo "Installing Python dependencies"
                    # Install necessary dependencies here, e.g.:
                    # pip install -r requirements.txt
                    '''
                }
            }
        }
        stage('Code Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'SonarQube', variable: 'SONAR_TOKEN')]) {
                        sh '''
                        echo "Starting Code Analysis"
                        sonar-scanner \
                            -Dsonar.projectKey=school_management_system \
                            -Dsonar.sources=. \
                            -Dsonar.python.version=3.12 \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.token=${SONAR_TOKEN}
                        '''
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    echo "Waiting for Quality Gate to pass"
                    // Wait for SonarQube Quality Gate status to be green (pass)
                    def qualityGate = waitForQualityGate()
                    if (qualityGate.status != 'OK') {
                        error "Quality Gate failed: ${qualityGate.status}"
                    }
                }
            }
        }
    }
}
