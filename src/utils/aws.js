import AWS from 'aws-sdk';
import axios from 'axios';

// Configure aws with your accessKeyId and your secretAccessKey
AWS.config.update({
	region          : 'us-east-2', // Put your aws region here
	accessKeyId     : process.env.REACT_APP_AWS_AccessKeyId,
	secretAccessKey : process.env.REACT_APP_AWS_SecretKey
});

const S3_BUCKET = process.env.REACT_APP_Bucket;

const s3 = new AWS.S3(); // Create a new instance of S3

export const SingS3 = async (fileName, fileType, folder, clientId) => {
	// Set up the payload of what we are sending to the S3 api

	const s3Params = {
		Bucket      : S3_BUCKET,
		Key         :
			process.env.REACT_APP_Staging !== 'production'
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
					url           : `https://${S3_BUCKET}.s3.amazonaws.com/${s3Params.Key}`
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
			process.env.REACT_APP_Staging !== 'production'
				? `dev/clients/${clientId}/${folder}/${fileName}`
				: `clients/${clientId}/${folder}/${fileName}`
	};

	s3.deleteObject(s3Params, (err, data) => {
		if (err) {
			return callback(false);
		}
		return callback(true);
	});
};

export const getSignedUrl = async (files, folder, clientId, callBack) => {
	const signedUrls = await files.map(async (file) => {
		const fileName = file.name.replace('.pdf', '').replace(/\s/g, '-').replace(/--/g, '-');
		const fileType = file.type;
		const data = await SingS3(fileName, fileType, folder, clientId);
		if (data.success) {
			const upload = await uploadFile({ fileType, signedRequest: data.data.signedRequest, file });
			if (upload) {
				return {
					...data.data,
					fileName,
					path     : file.path.replace(/\s/g, '-').replace(/--/g, '-')
				};
			} else {
				return false;
			}
		}
	});

	return callBack(Promise.all(signedUrls));
};
