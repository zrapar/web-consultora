import AWS from 'aws-sdk';
import axios from 'axios';

// Configure aws with your accessKeyId and your secretAccessKey
AWS.config.update({
	region          : 'us-east-2', // Put your aws region here
	accessKeyId     : process.env.REACT_APP_AWSAccessKeyId,
	secretAccessKey : process.env.REACT_APP_AWSSecretKey
});

const S3_BUCKET = process.env.REACT_APP_Bucket;

const s3 = new AWS.S3(); // Create a new instance of S3

export const SingS3 = async (fileName, fileType, folder, clientId) => {
	// Set up the payload of what we are sending to the S3 api

	const s3Params = {
		Bucket      : S3_BUCKET,
		Key         :
			axios.defaults.baseURL === 'http://127.0.0.1:8000'
				? `dev/clients/${clientId}/${folder}/${fileName}`
				: `clients/${clientId}/${folder}/${fileName}`,
		Expires     : 500,
		ContentType : fileType,
		ACL         : 'public-read'
	};

	// Make a request to the S3 API to get a signed URL which we can use to upload our file
	try {
		const response = await s3.getSignedUrl('putObject', s3Params);
		if (response.includes('https')) {
			return {
				success : true,
				data    : {
					signedRequest : response,
					url           : `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
				}
			};
		}
	} catch (err) {
		return {
			success : false,
			err
		};
	}
};

export const uploadFile = async ({ fileType, signedRequest, file }) => {
	const instanceAxiosAWS = axios.create({
		headers : {
			'Content-Type' : fileType
		}
	});

	delete instanceAxiosAWS.defaults.headers.common['Authorization'];
	try {
		const response = await instanceAxiosAWS.put(signedRequest, file);
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('jwt_access_token');
		if (response.status === 200 && response.statusText === 'OK') {
			return true;
		}
		return false;
	} catch (err) {
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('jwt_access_token');
		return false;
	}
};

export const deleteFile = async (fileName, folder, clientId, callback) => {
	const s3Params = {
		Bucket : S3_BUCKET,
		Key    :
			axios.defaults.baseURL === 'http://127.0.0.1:8000'
				? `dev/clients/${clientId}/${folder}/${fileName}`
				: `clients/${clientId}/${folder}/${fileName}`
	};

	s3.deleteObject(s3Params, (err, data) => {
		if (err) {
			return callback(false);
		}
		return callback(true);
	});

	// try {
	// 	const asd = await s3.deleteObject(s3Params);
	// 	console.log(asd);
	// } catch (err) {
	// 	console.log('response', err.response);
	// 	console.log('request', err.request);
	// }
};
