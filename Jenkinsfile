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
                    echo "Installing Python dependencies..."
                    # Uncomment and modify as needed to install dependencies
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
                        echo "Starting Code Analysis..."
                        sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=. \
                            -Dsonar.python.version=3.12 \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_TOKEN}
                        '''
                    }
                }
            }
        }

        // Uncomment the below stage if Quality Gate Check is needed
        /*
        stage('Quality Gate Check') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'SonarQube', variable: 'SONAR_TOKEN')]) {
                        script {
                            sh '''
                            echo "Setting up jq..."
                            mkdir -p ${HOME}/bin
                            curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o ${HOME}/bin/jq
                            chmod +x ${HOME}/bin/jq
                            export PATH=${HOME}/bin:$PATH
                            jq --version
                            '''

                            echo "Checking Quality Gate status..."
                            def response = sh(
                                script: """
                                    curl -s -u "${SONAR_TOKEN}:" "${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                                """,
                                returnStdout: true
                            ).trim()

                            echo "SonarQube Response: ${response}"

                            def status = sh(
                                script: """
                                    echo '${response}' | ${HOME}/bin/jq -r '.projectStatus.status'
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
        */

        stage('Build and Push Docker Image') {
            environment {
                DOCKER_IMAGE = "abiorh/school_management_system:${BUILD_NUMBER}"
            }
            steps {
                container('python') {
                    script {
                        sh '''
                        echo "Installing Docker and building the image..."
                        apt-get update && apt-get install -y docker.io
                        docker build -t ${DOCKER_IMAGE} .
                        '''

                        def dockerImage = docker.image("${DOCKER_IMAGE}")
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-cred') {
                            dockerImage.push()
                        }
                    }
                }
            }
        }
    }
}
