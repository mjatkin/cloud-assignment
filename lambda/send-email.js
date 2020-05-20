//console.log('Loading function');

/*exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    const message = event.Records[0].Sns.Message;
    console.log('From SNS:', message);
    return message;*/
    
//};

var aws = require('aws-sdk');
var ses = new aws.SES({region: 'REGION'});

exports.handler = (event, context, callback) => {
    const message = event.Records[0].Sns.Message;
    console.log('Received event:', JSON.stringify(event, null, 2));
     var params = {
        Destination: {
            ToAddresses: ["EMAIL"]
        },
        Message: {
            Body: {
                Text: { Data: message
                    
                }
                
            },
            
            Subject: { Data: "Transcoder"
                
            }
        },
        Source: "EMAIL"
    };

    
     ses.sendEmail(params, function (err, data) {
        callback(null, {err: err, data: data});
        if (err) {
            console.log(err);
            context.fail(err);
        } else {
            
            console.log(data);
            context.succeed(event);
        }
    });
};
