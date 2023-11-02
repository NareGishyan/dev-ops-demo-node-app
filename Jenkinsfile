pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-central-1'
        AWS_ACCOUNT_ID = '428496519623'
        ECR_REGISTRY = 'your-ecr-registry'
        ECR_REPOSITORY = 'jenkins'
        DOCKER_IMAGE_NAME = 'my-docker-image'
        ANSIBLE_HOST = '3.73.126.7'
        ANSIBLE_PLAYBOOK = '/var/lib/jenkins/workspace/multibranch-build_master/deploy_docker.yml'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                script {
                    git branch: 'master',
                        credentialsId: 'github-ssh',
                        url: 'https://github.com/NareGishyan/dev-ops-demo-node-app.git'
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def dockerImageTag = "${DOCKER_IMAGE_NAME}:${env.BUILD_ID}"

                    // Build the Docker image
                    sh "docker build -t ${dockerImageTag} ."

                    // Configure AWS credentials for ECR
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins']]) {
                        // Login to ECR
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                        // Tag the Docker image for ECR
                        sh "docker tag ${dockerImageTag} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${env.BUILD_ID}"

                        // Push the Docker image to ECR
                        sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${env.BUILD_ID}"
                    }
                }
            }
        }
        
        stage('Run Ansible Playbook') {
            steps {
                sh "ansible-playbook -i ${ANSIBLE_HOST}, ${ANSIBLE_PLAYBOOK}"
            }
        }
    }
}
