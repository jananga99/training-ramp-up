import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { Response, Request } from 'express';

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

const signInUser: SignInAuthDto = {
  email: 'john@gmail.com',
  password: 'John1@gmail.com',
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
    test('signs up a user', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValue(sampleUser);
      expect(await controller.signUp(signUpUser)).toBe(sampleUser);
    });
    test('signs up fails due to duplicated email', async () => {
      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(new Error('Duplicated email'));
      await expect(controller.signUp(signUpUser)).rejects.toThrowError(
        'Duplicated email',
      );
    });

    test('sign up fails due to error', async () => {
      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(new Error('error in user service'));
      await expect(controller.signUp(signUpUser)).rejects.toThrowError(
        'error in user service',
      );
    });
  });

  describe('signs in a user', () => {
    const getResponse = () =>
      ({ cookie: jest.fn().mockReturnThis() } as unknown as Response);
    test('signs in the user', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue(sampleUser);
      jest
        .spyOn(service, 'generateAccessToken')
        .mockReturnValue(sampleAccessToken);
      jest
        .spyOn(service, 'generateRefreshToken')
        .mockReturnValue(sampleRefreshToken);
      const res = getResponse();
      expect(await controller.signIn(signUpUser, res)).toStrictEqual({
        isAdmin: sampleUser.isAdmin,
      });
      expect(res.cookie).toHaveBeenCalledTimes(2);
    });

    test('sign in fails due to invalid email or password', async () => {
      jest
        .spyOn(service, 'signIn')
        .mockRejectedValue(new Error('Invalid Email or Password'));
      const res = getResponse();
      await expect(
        controller.signIn({ ...signUpUser, password: 'wrong' }, res),
      ).rejects.toThrowError('Invalid Email or Password');
      expect(res.cookie).toHaveBeenCalledTimes(0);
    });

    test('sign in fails due to error', async () => {
      jest
        .spyOn(service, 'signIn')
        .mockRejectedValue(new Error('error in signIn'));
      const res = getResponse();
      await expect(controller.signIn(signUpUser, res)).rejects.toThrowError(
        'error in signIn',
      );
      expect(res.cookie).toHaveBeenCalledTimes(0);
    });
  });

  describe('signs out a user', () => {
    const getResponse = () =>
      ({ clearCookie: jest.fn().mockReturnThis() } as unknown as Response);
    test('signs out the user', async () => {
      const res = getResponse();
      expect(await controller.signOut(res)).toStrictEqual({ success: true });
    });
    test('sign out fails due to error', async () => {
      const res = getResponse();
      jest.spyOn(res, 'clearCookie').mockImplementation(() => {
        throw new Error('error in clearCookie');
      });
      await expect(controller.signOut(res)).rejects.toThrowError(
        'error in clearCookie',
      );
    });
  });

  describe('refreshes a access token', () => {
    const getRequest = () =>
      ({
        user: sampleUser,
      } as unknown as Request);
    const getResponse = () =>
      ({ cookie: jest.fn().mockReturnThis() } as unknown as Response);
    test('refreshes the a', async () => {
      jest
        .spyOn(service, 'generateAccessToken')
        .mockReturnValue(sampleAccessToken);
      const req = getRequest();
      const res = getResponse();
      expect(await controller.refreshToken(req, res)).toStrictEqual({
        success: true,
      });
    });

    test('refresh fails due to error', async () => {
      jest.spyOn(service, 'generateAccessToken').mockImplementation(() => {
        throw new Error('error in generateAccessToken');
      });
      const req = getRequest();
      const res = getResponse();
      await expect(controller.refreshToken(req, res)).rejects.toThrowError(
        'error in generateAccessToken',
      );
    });
  });
});
