'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  	apiVersion: '2012-09-25'
});
var eltr = new AWS.ElasticTranscoder({
    apiVersion: '2012-09-25',
    region: 'REGION'
});

exports.handler = function(event, context) {
	console.log('Executing Elastic Transcoder Orchestrator');

	var bucket = event.Records[0].s3.bucket.name;
   	var key = event.Records[0].s3.object.key;
   	var pipelineId = 'ID';

   	console.log(key);
   	console.log(event.Records[0]);

   	if (bucket !== 'BUCKET') {
   		context.fail('Incorrect Video Input Bucket');
   		return;
   	}

   	var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); //the object may have spaces  
	var newKey = "public/complete/";

	var params = {
		PipelineId: pipelineId,
		OutputKeyPrefix: newKey,
		Input: {
			Key: srcKey,
			FrameRate: 'auto',
			Resolution: 'auto',
			AspectRatio: 'auto',
			Interlaced: 'auto',
			Container: 'auto'
		},
		Outputs: [{
			Key: (key.split('.')[0]).split('/')[1] + '.mp4',
			ThumbnailPattern: '',
			PresetId: '1351620000001-000061', //mp4
		}]
	};

	console.log('Starting Job');

	eltr.createJob(params, function(err, data){
		if (err){
			console.log(err);
		} else {
			console.log(data);
		}

		context.succeed('Job well done');
	});
};