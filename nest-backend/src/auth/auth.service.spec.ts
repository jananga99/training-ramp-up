import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { ConfigModule } from '@nestjs/config';
import { DUPLICATE_EMAIL_MESSAGE } from '../users/utils/const';
import { INVALID_CREDENTIALS_MESSAGE } from './utils/const';

const newUser: User = {
  email: 'john@gmail.com',
  firstName: 'John',
  isAdmin: undefined,
  lastName: 'Morrison',
  password: 'John1@gmail.com',
  timestamp: undefined,
};
const newAdminUser: User = {
  email: 'admin@gmail.com',
  firstName: 'Admin',
  isAdmin: undefined,
  lastName: 'Admin',
  password: 'Admin1@gmail.com',
  timestamp: undefined,
};
const sampleUser: User = {
  email: 'jesse@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};

describe('AuthService', () => {
  let service: AuthService;
  let repositoryMock: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            find: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOneBy: jest.fn(),
          })),
        },
        AuthService,
        UsersService,
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  describe('Signing Up User', () => {
    it('Sign up the new non admin a', async () => {
      const createdUser: User = {
        ...newUser,
        isAdmin: false,
        timestamp: Date.now(),
        password: '',
      };
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(createdUser);
      const result: User = await service.signUp(newUser);
      expect(result).toEqual(createdUser);
    });
    it('Sign up the new admin a', async () => {
      const createdUser: User = {
        ...newAdminUser,
        isAdmin: true,
        timestamp: Date.now(),
        password: '',
      };
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(createdUser);
      const result: User = await service.signUp(newAdminUser);
      expect(result).toEqual(createdUser);
    });
    it('Sign up fails due to duplicate email', async () => {
      const existingUser: User = {
        ...newUser,
        isAdmin: false,
        timestamp: Date.now(),
      };
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(existingUser);
      await expect(service.signUp(newUser)).rejects.toThrowError(
        DUPLICATE_EMAIL_MESSAGE,
      );
    });
    it('Sign up fails due to error relating to findOneBy', async () => {
      jest
        .spyOn(repositoryMock, 'findOneBy')
        .mockRejectedValue(new Error('findOneBy error'));
      await expect(service.signUp(newUser)).rejects.toThrowError(
        'findOneBy error',
      );
    });
    it('Sign up fails due to error relating to save', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(repositoryMock, 'save')
        .mockRejectedValue(new Error('save error'));
      await expect(service.signUp(newUser)).rejects.toThrowError('save error');
    });
  });

  describe('Validating the sign in of User', () => {
    it('Sign in success', async () => {
      const saltRounds: number = 10;
      const hashed: string = await bcrypt.hash(
        sampleUser.password as string,
        saltRounds,
      );
      const existingUser: User = { ...sampleUser, password: hashed };
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(existingUser);
      const result = await service.signIn(
        sampleUser.email as string,
        sampleUser.password as string,
      );
      expect(result).toEqual(existingUser);
    });
    it('Sign in fails due to wrong email', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      await expect(
        service.signIn(
          sampleUser.email as string,
          sampleUser.password as string,
        ),
      ).rejects.toThrowError(INVALID_CREDENTIALS_MESSAGE);
    });
    it('Sign in fails due to wrong password', async () => {
      const saltRounds: number = 10;
      const hashed: string = await bcrypt.hash(
        sampleUser.password as string,
        saltRounds,
      );
      sampleUser.password = hashed;
      const existingUser: User = { ...sampleUser, password: hashed };
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(existingUser);
      await expect(
        service.signIn(sampleUser.email as string, 'wrong'),
      ).rejects.toThrowError(INVALID_CREDENTIALS_MESSAGE);
    });
    it('Sign in fails due to error relating to findOneBy', async () => {
      jest
        .spyOn(repositoryMock, 'findOneBy')
        .mockRejectedValue(new Error('findOneBy error'));
      await expect(
        service.signIn(
          sampleUser.email as string,
          sampleUser.password as string,
        ),
      ).rejects.toThrowError('findOneBy error');
    });
  });

  describe('Generates an access token', () => {
    it('token generates', async () => {
      const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
      const result: string = service.generateAccessToken(
        sampleUser.email as string,
      );
      const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload;
      expect(decode.email).toEqual(sampleUser.email);
    });
    it('token generates for wrong email', async () => {
      const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
      const result: string = service.generateAccessToken('wrong');
      const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload;
      expect(decode.email).not.toEqual(sampleUser.email);
    });
  });

  describe('Generates a refresh token', () => {
    it('token generates', async () => {
      const secret: string = process.env.REFRESH_TOKEN_SECRET as string;
      const result: string = service.generateRefreshToken(
        sampleUser.email as string,
      );
      const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload;
      expect(decode.email).toEqual(sampleUser.email);
    });
    it('token generates for wrong email', async () => {
      const secret: string = process.env.REFRESH_TOKEN_SECRET as string;
      const result: string = service.generateRefreshToken('wrong');
      const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload;
      expect(decode.email).not.toEqual(sampleUser.email);
    });
  });
});
