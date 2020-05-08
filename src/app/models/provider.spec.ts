import { Provider } from './provider';

describe('Provider', () => {
  it('should create an instance', () => {
    expect(new Provider('name', 'https://uwaterloo.ca/events/sites/ca.events/files/uploads/images/google-logo_0.jpg',
      'description', [])).toBeTruthy();
  });
});
