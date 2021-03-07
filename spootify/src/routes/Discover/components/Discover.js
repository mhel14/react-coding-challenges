import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';

import { getRawData, fetcher, getCachedData } from './../../../utils/request';
import api from '../../../config';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  handleAuthorization = async () => {
    const { api: { clientId, authUrl, clientSecret } } = api
    const encodedData = window.btoa(`${clientId}:${clientSecret}`)
    try {
      const { access_token } = await getRawData({
        url: authUrl,
        method: 'post',
        data: 'grant_type=client_credentials',
        headers: {
          'Authorization': `Basic ${encodedData}`,
        },
      })
      
      if(access_token) {
        this.handleFetchNewRealeases(access_token);
        this.handleFetchFeaturedPlaylist(access_token);
        this.handleFetchGenreCategories(access_token);
      }
    } catch(err) {
      console.error('Authorization', err)
    }
  }

  handleFetchNewRealeases = async (accessToken) => {
    const { albums } = await fetcher('/browse/new-releases', accessToken) || [];

    if(albums) {
      this.setState({
        newReleases: albums.items
      })
    }
  }

  handleFetchFeaturedPlaylist = async (accessToken) => {
    const { playlists } = await fetcher('/browse/featured-playlists', accessToken) || [];

    if(playlists) {
      this.setState({
        playlists: playlists.items
      })
    }
  }

  handleFetchGenreCategories = async (accessToken) => {
    const { categories } = await fetcher('/browse/categories', accessToken) || [];
    
    if(categories) {
      this.setState({
        categories: categories.items
      })
    }
  }

  handleFetchFromCache = async () => {
    const { albums } = await getCachedData('/browse/new-releases') || [];
    const { playlists } = await getCachedData('/browse/featured-playlists') || [];
    const { categories } = await getCachedData('/browse/categories') || [];
    
    this.setState({
      playlists: playlists?.items || [],
      newReleases: albums?.items || [],
      categories: categories?.items || []
    })
  }

  componentDidMount() {
    this.handleFetchFromCache();
    this.handleAuthorization();
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
