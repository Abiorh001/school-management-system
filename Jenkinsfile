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
    - name: frontend
      image: node:18-alpine
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
        APP_NAME = 'school_management_system_frontend'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                container('frontend') {
                    sh '''
                    echo "Installing dependencies..."
                    npm install
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
                        -Dsonar.nodejs.executable=node
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build and Push Docker Image') {
            environment {
                DOCKER_IMAGE = "abiorh/school_management_system_frontend:${BUILD_NUMBER}"
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

        stage('Update Deployment File') {
            environment {
                GIT_REPO_NAME = "school-management-system-"
                GIT_USER_NAME = "abiorh001"
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
                       
                        sed -i -E "s|abiorh/school_management_system_frontend:[[:alnum:]._-]*|abiorh/school_management_system_frontend:${BUILD_NUMBER}|g" deployment/frontend_deployement.yaml

                        if grep -q "abiorh/${APP_NAME}:${BUILD_NUMBER}" deployment/frontend_deployement.yaml; then
                            echo "Successfully updated deployment file"
                        else
                            echo "Failed to update deployment file"
                            exit 1
                        fi

                        git add deployment/frontend_deployement.yaml
                        git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                        git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:deploy
                        """
                    }
                }
            }
        }
    } // End of stages
} // End of pipeline
