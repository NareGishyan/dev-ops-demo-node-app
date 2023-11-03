pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-central-1'
        AWS_ACCOUNT_ID = '295390758353'
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
        
                        // sh "aws ecr-public get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin public.ecr.aws"
                        sh "aws ecr-public get-login-password --region eu-central-1 | docker login --username AWS -p $(aws ecr get-login-password --region eu-central-1 ) public.ecr.aws/y2h4n5k3/jenkins-public

                        // Tag the Docker image for ECR
                        sh "docker tag ${dockerImageTag} public.ecr.aws/y2h4n5k3/jenkins-public"

                        // Push the Docker image to ECR
                        sh "docker push public.ecr.aws/y2h4n5k3/jenkins-public"
                    }
                }
            }
        }
        
        stage('Run Ansible Playbook') {
            steps {
                script {
                    ansiblePlaybook([
                        credentialsId: "ansimble-ssh",
                        playbook: "${ANSIBLE_PLAYBOOK}",
                        inventory: '/var/lib/jenkins/workspace/multibranch-build_master/ansible-inventory',  // Specify the path to your Ansible inventory file
                        colorized: true,
                    ])
                }
            }
        }
    }
}
