import crypto from 'node:crypto'
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@sentry-shift/env/server'

const s3 = new S3Client({
	region: 'auto',
	endpoint: env.S3URL,
	forcePathStyle: true,
	credentials: {
		accessKeyId: env.ACCESSKEY_ID,
		secretAccessKey: env.SECRET_ACCESS_KEY,
	},
})

const getObjectKey = (name: string, bytes = 32) =>
	`${crypto.randomBytes(bytes).join('')}-${name}`

export async function getUploadUrl(name: string, contentType: string) {
	const key = getObjectKey(name)
	const command = new PutObjectCommand({
		Bucket: env.BUCKET_NAME,
		ContentType: contentType,
		Key: key,
	})
	const url = await getSignedUrl(s3, command, { expiresIn: 180 })
	return { url, key }
}

export async function deleteObject(key: string) {
	const command = new DeleteObjectCommand({
		Key: key,
		Bucket: env.BUCKET_NAME,
	})
	await s3.send(command)
}

export async function getSingedUrl(key: string) {
	const command = new GetObjectCommand({
		Bucket: env.BUCKET_NAME,
		Key: key,
	})
	return await getSignedUrl(s3, command, { expiresIn: 3700 })
}
