// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, use localhost
// For physical device, use your computer's IP address
const API_BASE_URL = 'http://10.0.2.2:3001/api'; // Android emulator
// const API_BASE_URL = 'http://localhost:3001/api'; // iOS simulator
// const API_BASE_URL = 'http://192.168.1.XXX:3001/api'; // Physical device (replace with your IP)

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log(`📡 API Response: ${response.status}`, data);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Game endpoints
  async startGame(startedBy) {
    return this.request('/game/start', {
      method: 'POST',
      body: JSON.stringify({ startedBy }),
    });
  }

  async makeMove(gameId, row, col) {
    return this.request('/game/move', {
      method: 'POST',
      body: JSON.stringify({ gameId, row, col }),
    });
  }

  async getGameState(gameId) {
    return this.request(`/game/${gameId}`);
  }

  // Stats endpoints
  async getStats() {
    return this.request('/stats/my-stats');
  }

  async getRecentGames(limit = 10) {
    return this.request(`/stats/recent-games?limit=${limit}`);
  }

  async getDetailedStats() {
    return this.request('/stats/detailed-stats');
  }

  async getLeaderboard() {
    return this.request('/stats/leaderboard');
  }
}

export default new ApiService(); 