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
    - name: utils
      image: curlimages/curl:8.5.0
      command:
        - cat
      tty: true
      volumeMounts:
        - name: jq-binary
          mountPath: /usr/local/bin/jq
  volumes:
    - name: jq-binary
      emptyDir: {}
"""
        }
    }
    environment {
        SONAR_HOST_URL = 'http://192.168.1.185:30942'
        SONAR_PROJECT_KEY = 'school_management_system'
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
        
        
        stage('Install jq') {
            steps {
                container('utils') {
                    sh '''
                        curl -L https://github.com/stedolan/jq/releases/download/jq-1.7.1/jq-linux64 -o /usr/local/bin/jq
                        chmod +x /usr/local/bin/jq
                        jq --version
                    '''
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                container('utils') {
                    withCredentials([string(credentialsId: 'SonarQube', variable: 'SONAR_TOKEN')]) {
                        script {
                            echo "Checking Quality Gate status..."
                            def response = sh(
                                script: """
                                    set +x
                                    curl -s -u "${SONAR_TOKEN}:" "${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                                """,
                                returnStdout: true
                            ).trim()
                            
                            def status = sh(
                                script: """
                                    echo '${response}' | /usr/local/bin/jq -r '.projectStatus.status'
                                """,
                                returnStdout: true
                            ).trim()
                            
                            if (status != 'OK') {
                                error "Quality Gate failed with status: ${status}"
                            } else {
                                echo "Quality Gate passed!"
                            }
                        }
                    }
                }
            }
        }
    }
}