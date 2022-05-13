#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { WorkshopPipelineStack } from '../lib/pipeline-stack';

console.log(process.env);

const app = new cdk.App();
new WorkshopPipelineStack(app, 'CdkWorkshopStack');
