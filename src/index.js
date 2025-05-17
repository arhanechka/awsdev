const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
    console.log('S3 Event:', JSON.stringify(event, null, 2));
    
    const record = event.Records[0].s3;
    const bucketName = record.bucket.name;
    const fileName = record.object.key;
    
    const message = {
        default: `New file uploaded: ${fileName}`,
        email: `File ${fileName} was uploaded to bucket ${bucketName}`,
    };
    
    try {
        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_ARN,
            Message: JSON.stringify(message),
            MessageStructure: 'json'
        }).promise();
        
        console.log('Successfully sent SNS notification');
        console.log('test message')
        return { statusCode: 200, body: 'Notification sent' };
    } catch (error) {
        console.error('SNS publish error:', error);
        throw error;
    }
};