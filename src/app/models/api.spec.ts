import { API } from './api';

describe('API', () => {
  it('should create an instance', () => {
    expect(new API('name', 'https://uwaterloo.ca/events/sites/ca.events/files/uploads/images/google-logo_0.jpg', ['Free'])).toBeTruthy();
  });
});
