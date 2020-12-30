import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';

xdescribe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
