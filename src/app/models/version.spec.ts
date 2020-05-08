import { Version } from './version';

describe('Version', () => {
  it('should create an instance', () => {
    expect(new Version('v1.0.0', 'docContent', 'description', '', '')).toBeTruthy();
  });
});
