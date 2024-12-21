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
                withSonarQubeEnv(credentialsId: 'SonarQube', installationName: 'SonarQube-installation') {  // Use your credentials ID
                    sh """
                        echo "Running SonarQube analysis..."
                        ${tool('SonarScanner')}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=. \
                            -Dsonar.python.version=3.12 \
                            
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
                            docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
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
