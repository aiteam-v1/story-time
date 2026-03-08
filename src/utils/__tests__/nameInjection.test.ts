import { injectName } from '../nameInjection';

describe('injectName', () => {
  it('replaces default name with hero name', () => {
    expect(injectName('Oliver went to the moon.', 'Oliver', 'Emma')).toBe(
      'Emma went to the moon.'
    );
  });

  it('replaces multiple occurrences', () => {
    expect(
      injectName('Oliver saw Oliver in the mirror.', 'Oliver', 'Emma')
    ).toBe('Emma saw Emma in the mirror.');
  });

  it('preserves capitalization — capitalized match gets capitalized replacement', () => {
    expect(injectName('Oliver is brave.', 'Oliver', 'emma')).toBe(
      'Emma is brave.'
    );
  });

  it('preserves capitalization — lowercase match gets lowercase replacement', () => {
    // story text won't normally have lowercase name, but let's cover it
    expect(injectName('Meet oliver today.', 'Oliver', 'Emma')).toBe(
      'Meet emma today.'
    );
  });

  it('returns original text when heroName is empty', () => {
    expect(injectName('Oliver went home.', 'Oliver', '')).toBe(
      'Oliver went home.'
    );
  });

  it('returns original text when heroName is whitespace only', () => {
    expect(injectName('Oliver went home.', 'Oliver', '   ')).toBe(
      'Oliver went home.'
    );
  });

  it('trims whitespace from heroName', () => {
    expect(injectName('Oliver went home.', 'Oliver', '  Emma  ')).toBe(
      'Emma went home.'
    );
  });

  it('is case-insensitive for the default name', () => {
    expect(injectName('OLIVER shouted.', 'Oliver', 'Emma')).toBe(
      'Emma shouted.'
    );
  });
});
