import { TestBed } from '@angular/core/testing';

import { CheckAuthorityResolver } from './check-authority.resolver';

describe('CheckAuthorityResolver', () => {
  let resolver: CheckAuthorityResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CheckAuthorityResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
