import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { HitCounter } from '../lib/hit-counter';
import { Capture, Template } from 'aws-cdk-lib/assertions';

test('Lambda Has Environment Variables', () => {
    const stack = new cdk.Stack();

    new HitCounter(stack, 'MyTestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'hello.handler',
            code: lambda.Code.fromAsset('src'),
        }),
    });

    const template = Template.fromStack(stack);
    const envCapture = new Capture();
    template.hasResourceProperties('AWS::Lambda::Function', {
        Environment: envCapture,
    });

    expect(envCapture.asObject()).toEqual(
        {
            Variables: {
                DOWNSTREAM_FUNCTION_NAME: {
                    Ref: 'TestFunction22AD90FC',
                },
                HITS_TABLE_NAME: {
                    Ref: 'MyTestConstructHits24A357F0'
                }
            }
        }
    )
});

test('read capacity can be configured', () => {
    const stack = new cdk.Stack();

    expect(() => {
        new HitCounter(stack, 'MyTestConstruct', {
            downstream: new lambda.Function(stack, 'TestFunction', {
                runtime: lambda.Runtime.NODEJS_14_X,
                handler: 'hello.handler',
                code: lambda.Code.fromAsset('src'),
            }),
            readCapacity: 3
        });
    }).toThrowError(/readCapacity must be greater than 5 and less than 20/);
});
