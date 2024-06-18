const { api } = require('../models/index');

describe('API Configuration', () => {
    it('should have correct base URL and headers', () => {
        expect(api.defaults.baseURL).toEqual(`${process.env.API_URL}/rest`);
        expect(api.defaults.headers['x-apikey']).toEqual(process.env.API_KEY);
    });
});