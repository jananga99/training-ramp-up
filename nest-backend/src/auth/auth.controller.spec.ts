import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { Response, Request } from 'express';
import { DUPLICATE_EMAIL_MESSAGE } from '../users/utils/const';
import { INVALID_CREDENTIALS_MESSAGE } from './utils/const';

const signUpUser: SignUpAuthDto = {
  email: 'john@gmail.com',
  firstName: 'John',
  lastName: 'Morrison',
  password: 'John1@gmail.com',
};
const sampleUser: User = {
  email: 'john@gmail.com',
  firstName: 'John',
  isAdmin: false,
  lastName: 'Morrison',
  password: 'John1@gmail.com',
  timestamp: Date.now(),
};

const sampleAccessToken = 'sample-token';
const sampleRefreshToken = 'sample-refresh-token';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: jest.fn(() => ({
            signUp: jest.fn(),
            signIn: jest.fn(),
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
          })),
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('signs up a new user', () => {
    it('signs up a user', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValue(sampleUser);
      expect(await controller.signUp(signUpUser)).toBe(sampleUser);
    });
    it('signs up fails due to duplicated email', async () => {
      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(new Error(DUPLICATE_EMAIL_MESSAGE));
      await expect(controller.signUp(signUpUser)).rejects.toThrowError(
        DUPLICATE_EMAIL_MESSAGE,
      );
    });

    it('sign up fails due to error', async () => {
      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(new Error('error in user service'));
      await expect(controller.signUp(signUpUser)).rejects.toThrowError(
        'error in user service',
      );
    });
  });

  describe('signs in a user', () => {
    const getResponse: () => Response = (): Response =>
      ({ cookie: jest.fn().mockReturnThis() } as unknown as Response);
    it('signs in the user', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue(sampleUser);
      jest
        .spyOn(service, 'generateAccessToken')
        .mockReturnValue(sampleAccessToken);
      jest
        .spyOn(service, 'generateRefreshToken')
        .mockReturnValue(sampleRefreshToken);
      const res: Response = getResponse();
      expect(await controller.signIn(signUpUser, res)).toStrictEqual({
        isAdmin: sampleUser.isAdmin,
      });
      expect(res.cookie).toHaveBeenCalledTimes(2);
    });

    it('sign in fails due to invalid email or password', async () => {
      jest
        .spyOn(service, 'signIn')
        .mockRejectedValue(new Error(INVALID_CREDENTIALS_MESSAGE));
      const res: Response = getResponse();
      await expect(
        controller.signIn({ ...signUpUser, password: 'wrong' }, res),
      ).rejects.toThrowError(INVALID_CREDENTIALS_MESSAGE);
      expect(res.cookie).toHaveBeenCalledTimes(0);
    });

    it('sign in fails due to error', async () => {
      jest
        .spyOn(service, 'signIn')
        .mockRejectedValue(new Error('error in signIn'));
      const res: Response = getResponse();
      await expect(controller.signIn(signUpUser, res)).rejects.toThrowError(
        'error in signIn',
      );
      expect(res.cookie).toHaveBeenCalledTimes(0);
    });
  });

  describe('signs out a user', () => {
    const getResponse: () => Response = (): Response =>
      ({ clearCookie: jest.fn().mockReturnThis() } as unknown as Response);
    it('signs out the user', async () => {
      const res: Response = getResponse();
      expect(await controller.signOut(res)).toStrictEqual({ success: true });
    });
    it('sign out fails due to error', async () => {
      const res: Response = getResponse();
      const spy = jest.spyOn(res, 'clearCookie').mockImplementation(() => {
        throw new Error('error in clearCookie');
      });
      try {
        controller.signOut(res);
      } catch (err) {
        expect(err).toHaveProperty('message', 'error in clearCookie');
      }
      expect(spy).toThrowError('error in clearCookie');
    });
  });

  describe('refreshes a access token', () => {
    const getRequest: () => Request = (): Request =>
      ({
        user: sampleUser,
      } as unknown as Request);
    const getResponse: () => Response = (): Response =>
      ({ cookie: jest.fn().mockReturnThis() } as unknown as Response);
    it('refreshes the a', async () => {
      jest
        .spyOn(service, 'generateAccessToken')
        .mockReturnValue(sampleAccessToken);
      const req: Request = getRequest();
      const res: Response = getResponse();
      expect(await controller.refreshToken(req, res)).toStrictEqual({
        success: true,
      });
    });

    it('refresh fails due to error', async () => {
      const spy = jest
        .spyOn(service, 'generateAccessToken')
        .mockImplementation(() => {
          throw new Error('error in generateAccessToken');
        });
      const req: Request = getRequest();
      const res: Response = getResponse();
      try {
        controller.refreshToken(req, res);
      } catch (err) {
        expect(err).toHaveProperty('message', 'error in generateAccessToken');
      }
      expect(spy).toThrowError('error in generateAccessToken');
    });
  });
});
