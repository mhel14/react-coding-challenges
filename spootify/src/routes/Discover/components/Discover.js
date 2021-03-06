import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';

import { getRawData, fetcher, getCachedData } from './../../../utils/request';
import api from '../../../config';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      accessToken: '',
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
        this.setState({
          accessToken: access_token
        });
      }

      if(this.state.accessToken) {
        this.handleFetchNewRealeases();
        this.handleFetchFeaturedPlaylist();
        this.handleFetchGenreCategories();
      }
    } catch(err) {
      console.error('Authorization', err)
    }
  }

  handleFetchNewRealeases = async () => {
    const { albums } = await fetcher('/browse/new-releases', this.state.accessToken) || [];

    if(albums) {
      this.setState({
        newReleases: albums.items
      })
    }
  }

  handleFetchFeaturedPlaylist = async () => {
    const { playlists } = await fetcher('/browse/featured-playlists', this.state.accessToken) || [];

    if(playlists) {
      this.setState({
        playlists: playlists.items
      })
    }
  }

  handleFetchGenreCategories = async () => {
    const { categories } = await fetcher('/browse/categories', this.state.accessToken) || [];
    
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
