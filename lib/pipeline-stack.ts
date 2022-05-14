import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { WorkshopPipelineStage } from './pipeline-stage';

export class WorkshopPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'WorkshopPipeline',
            synth: new CodeBuildStep('SynthStep', {
                input: CodePipelineSource.connection('hamologist/cdk-workshop', 'main', {
                    connectionArn: ssm.StringParameter.valueForStringParameter(this, '/cdk/cdk-workshop/connection-arn'),
                }),
                installCommands: [
                    'npm install -g aws-cdk',
                ],
                commands: [
                    'npm ci',
                    'cd src && npm ci && cd ..',
                    'npm run build',
                    'npx cdk synth',
                ],
            }),
        });

        const deploy = new WorkshopPipelineStage(this, 'Deploy');
        const deployStage = pipeline.addStage(deploy);
    }
}
