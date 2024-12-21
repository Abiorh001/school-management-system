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
                container('sonar-scanner') {
                    sh '''
                        echo "Checking OS distribution..."
                        if [ -f /etc/os-release ]; then
                            cat /etc/os-release
                        fi
                        
                        # Download and install jq directly
                        curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /usr/local/bin/jq
                        chmod +x /usr/local/bin/jq
                        jq --version
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
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=. \
                            -Dsonar.python.version=3.12 \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.token=${SONAR_TOKEN}
                        '''
                    }
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                container('sonar-scanner') {
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
                                    echo '${response}' | jq -r '.projectStatus.status'
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