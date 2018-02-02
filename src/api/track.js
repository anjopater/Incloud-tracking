import axios from 'axios';
import config from '../config';

export const saveTrack = ({data}) => {
    return axios.request({
        url: config.API_URL + '/save',
        method: 'POST',
        data: data
    });
};

export const fetchAllTracks = ({data}) => {
    return axios.request({
        url: config.API_URL + '/all',
        method: 'GET',
        params: data
    });
};