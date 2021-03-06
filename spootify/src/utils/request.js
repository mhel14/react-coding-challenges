import axios from 'axios';
import { readFromCache, writeToCache } from './cache';
import api from '../config';

const getRawData = async (config, path, cacheEnabled = false) => {
	const { data } = await axios(config);
	cacheEnabled && writeToCache(path, data);
	return data;
};

const getCachedData = (url) => readFromCache(url);

const fetcher = async (path = '', token = '') => {
	const { api: { baseUrl } } = api;
	try {
		const data = await getRawData(
			{
				url: baseUrl + path,
				method: 'get',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			},
			path,
			'enableCache'
		);

		if (data) {
			return data;
		}
	} catch (err) {
		console.error(`${path} `, err);
	}
};

export { getCachedData, getRawData, fetcher };
