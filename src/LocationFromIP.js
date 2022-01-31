// dependencies / things imported
import { LitElement, html, css } from 'lit';
import { UserIP } from './UserIP.js';
import '@lrnwebcomponents/wikipedia-query/wikipedia-query.js';

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }
  static properties = {
    locationEndpoint: {},
    long: {},
    lat: {},
    city: {},
    state: {},
  };

  constructor() {
    super();
    this.UserIpInstance = new UserIP();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    this.long = this.getGEOIPData.longitude;
    this.lat = this.getGEOIPData.latitude;
    this.city = null;
    this.state = null;
  }

  // not sure what this does, might be setting the Geo location 
  //to where the webpage was originally created?
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  async getGEOIPData() {
    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.long = data.longitude;
        this.lat = data.latitude;
        this.city = data.city;
        this.state = data.region_name;
        return data;
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like
    const url = `https://maps.google.com/maps?q=${this.lat},${this.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return html`<iframe title="Where you are" src="${url}"></iframe> 
      <a href="https://www.google.com/maps/@lat,long,14z">View in Google Maps</a>
      <wikipedia-query search="${this.city}, ${this.state}"></wikipedia-query>
      <wikipedia-query search="${this.city}"></wikipedia-query>
      <wikipedia-query search="${this.state}"></wikipedia-query>`;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
