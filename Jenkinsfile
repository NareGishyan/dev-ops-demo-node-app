pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-central-1'
        AWS_ACCOUNT_ID = '428496519623'
        ECR_REGISTRY = 'your-ecr-registry'
        ECR_REPOSITORY = 'jenkins'
        DOCKER_IMAGE_NAME = 'tigran222/my-app'
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

        stage('Create infrastructure with Terraform') {
            steps {
                script {
                    // Configure AWS credentials for Terraform
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins']]) {

                        // sh 'terraform -chdir=./terraform init'

                        // // Apply the Terraform template
                        // sh 'terraform  -chdir=./terraform apply -auto-approve'
                        // def asgName = sh(script: "terraform output -json asg_name", returnStdout: true).trim()

                         // Set the ASG name as an environment variable
                        currentBuild.buildEnviroment['ASG_NAME'] = "web-lc-20231103204537013900000001-asg" // asgName
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {

                    def dockerImageTag = "${DOCKER_IMAGE_NAME}:${env.BUILD_ID}"

                    // Build the Docker image
                    //sh "docker build -t ${dockerImageTag} ."
                    dockerImage = docker.build(dockerImageTag)

                    // Configure AWS credentials for ECR
                 //   withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins']]) {
                        // Login to ECR
                   //     sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                        // Tag the Docker image for ECR
                     //   sh "docker tag ${dockerImageTag} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${env.BUILD_ID}"

                        // Push the Docker image to ECR
                       // sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${env.BUILD_ID}"
                    //}
                       withDockerRegistry([credentialsId: 'docker-pass', url: ""]) {
                           dockerImage.push()
                        }
                }


            }

        }


        stage('Run Ansible Playbook') {
            steps {
                script {
                    ansiblePlaybook([
                        playbook: "${ANSIBLE_PLAYBOOK}",
                        inventory: '/var/lib/jenkins/workspace/multibranch-build_master/ansible-inventory',  // Specify the path to your Ansible inventory file
                        colorized: true,
                        extraVars: [docker_image_tag: "${DOCKER_IMAGE_NAME}:${env.BUILD_ID}", asg_name: "${evn.ASG_NAME}"]
                    ])
                }
            }
        }
    }
}
