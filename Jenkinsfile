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
    - name: docker
      image: docker:20.10.24
      command:
        - cat
      tty: true
      securityContext:
        privileged: true
      volumeMounts:
        - name: docker-socket
          mountPath: /var/run/docker.sock
  volumes:
    - name: docker-socket
      hostPath:
        path: /var/run/docker.sock
        type: Socket
"""
        }
    }
    environment {
        SONAR_HOST_URL = 'http://192.168.1.185:30942'
        SONAR_PROJECT_KEY = 'school_management_system'
        DOCKER_REGISTRY = 'docker.io'
        APP_NAME = 'school_management_system'
    }
    stages {
        stage('Install Python Dependencies') {
            steps {
                container('python') {
                    sh '''
                    echo "Installing Python dependencies..."
                    # pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Code Analysis') {
            steps {
                withSonarQubeEnv(credentialsId: 'SonarQube', installationName: 'SonarQube-installation') {
                    sh """
                    echo "Running SonarQube analysis..."
                    ${tool('SonarScanner')}/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.sources=. \
                        -Dsonar.python.version=3.12
                    """
                }
            }
        }

        // stage('Quality Gate') {
        //     steps {
        //         timeout(time: 5, unit: 'MINUTES') {
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }

        stage('Update Deployment File') {
            environment {
            GIT_REPO_NAME = "school-management-system-"
            GIT_USER_NAME = "aabiorh001"
        }
            steps {
                script {
                    withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
                        sh """
                        echo "Updating deployment file..."
                        git config user.email "abiolaadedayo1993@gmail.com"
                        git config user.name "abiorh001"
                        
                        git fetch origin deploy
                        git checkout deploy

                        sed -i -E "s|${DOCKER_REGISTRY}/${APP_NAME}:[[:alnum:]._-]*|${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}|g" ./backend_deployment.yaml

                        if grep -q "${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}" ./backend_deployment.yaml; then
                            echo "Successfully updated deployment file"
                        else
                            echo "Failed to update deployment file"
                            exit 1
                        fi

                        git add backend_deployment.yaml
                        git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                        git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:deploy
                        """
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            environment {
                DOCKER_IMAGE = "abiorh/school_management_system:${BUILD_NUMBER}"
            }
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        script {
                            sh '''
                            echo "Building Docker Image..."
                            docker build -t ${DOCKER_IMAGE} .
                            echo "Logging into Docker Hub..."
                            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                            echo "Pushing Docker Image..."
                            docker push ${DOCKER_IMAGE}
                            '''
                        }
                    }
                }
            }
        }
    }
}
