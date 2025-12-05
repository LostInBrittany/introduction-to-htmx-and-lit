import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.3.1/all/lit-all.min.js';

/**
 * Or if you want a local copy of the library
 * import { LitElement, html, css } from '/lib/lit-all.min.js';
 */


export class WeatherWidget extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      weatherData: { type: Object }
    };
  }

  static get styles() {
    return css`
 :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }
      .weather-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        border-radius: 12px;
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        min-width: 180px;
        max-width: 260px;
        text-align: center;
        transition: transform 0.2s ease-in-out;
      }
      .weather-container:hover {
        transform: scale(1.05);
      }
      .weather-header {
        font-size: 1.4rem;
        font-weight: bold;
        color: #333;
      }
      .weather-temp {
        font-size: 2.5rem;
        font-weight: bold;
        color: #222;
        margin: 0.5rem 0;
      }
      .weather-emoji {
        font-size: 3rem;
        margin: 0.5rem 0;
        position: relative;
        cursor: help;
      }
      .weather-emoji:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
        white-space: nowrap;
        pointer-events: none;
        opacity: 1;
        transition: opacity 0.2s;
      }
    `;
  }

  constructor() {
    super();
    this.name = "";
    this.latitude = 0;
    this.longitude = 0;
    this.weatherData = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchWeather();
  }

  async fetchWeather() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current_weather=true`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.weatherData = data.current_weather;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  }

  getWeatherInfo(code) {
    const weatherMap = {
      0: { emoji: "☀️", description: "Clear sky" },
      1: { emoji: "🌤", description: "Mainly clear" },
      2: { emoji: "⛅", description: "Partly cloudy" },
      3: { emoji: "☁️", description: "Overcast" },
      45: { emoji: "🌫", description: "Foggy" },
      48: { emoji: "🌫", description: "Depositing rime fog" },
      51: { emoji: "🌦", description: "Light drizzle" },
      53: { emoji: "🌧", description: "Moderate drizzle" },
      55: { emoji: "🌧", description: "Dense drizzle" },
      56: { emoji: "🌨", description: "Light freezing drizzle" },
      57: { emoji: "🌨", description: "Dense freezing drizzle" },
      61: { emoji: "🌦", description: "Slight rain" },
      63: { emoji: "🌧", description: "Moderate rain" },
      65: { emoji: "🌧", description: "Heavy rain" },
      66: { emoji: "🌨", description: "Light freezing rain" },
      67: { emoji: "🌨", description: "Heavy freezing rain" },
      71: { emoji: "❄️", description: "Slight snowfall" },
      73: { emoji: "❄️", description: "Moderate snowfall" },
      75: { emoji: "❄️", description: "Heavy snowfall" },
      77: { emoji: "🌨", description: "Snow grains" },
      80: { emoji: "🌦", description: "Slight rain showers" },
      81: { emoji: "🌧", description: "Moderate rain showers" },
      82: { emoji: "🌧", description: "Heavy rain showers" },
      85: { emoji: "❄️", description: "Slight snow showers" },
      86: { emoji: "❄️", description: "Heavy snow showers" },
      95: { emoji: "⛈", description: "Thunderstorm" },
      96: { emoji: "⛈🌨", description: "Thunderstorm with slight hail" },
      99: { emoji: "⛈🌨", description: "Thunderstorm with heavy hail" },
    };
    return weatherMap[code] || { emoji: "❓", description: "Unknown weather" };
  }

  render() {
    return html`
      <div class="weather-container">
        <div class="weather-header">${this.name}</div>
        ${this.weatherData
        ? html`
              <div class="weather-temp">${this.weatherData.temperature}°C</div>
              <div class="weather-emoji" 
                  data-tooltip="${this.getWeatherInfo(this.weatherData.weathercode).description}">
                ${this.getWeatherInfo(this.weatherData.weathercode).emoji}
              </div>
              <div>${this.weatherData.windspeed} km/h wind</div>
            `
        : html`<p>Loading...</p>`}
      </div>
    `;
  }
}

customElements.define('weather-widget', WeatherWidget);
