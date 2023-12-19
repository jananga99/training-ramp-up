import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { USER_NOT_FOUND_MESSAGE } from './utils/const';
const newUser: User = {
  email: 'john@gmail.com',
  firstName: 'John',
  isAdmin: undefined,
  lastName: 'Morrison',
  password: 'John1@gmail.com',
  timestamp: undefined,
};
const user1: User = {
  email: 'jesse1@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};
const user2: User = {
  email: 'jesse2@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};
const users: User[] = [user1, user2];
const updateuser: User = {
  email: 'jesse@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wellhjgjs',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};
const removeuser: User = {
  email: 'jesse@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wellhjgjs',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            find: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          })),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });
  describe('User Getting', () => {
    it('get all the users', async () => {
      jest.spyOn(repositoryMock, 'find').mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(user1);
      expect(result).toContainEqual(user2);
      expect(result).toEqual(users);
    });
    it('error in find', async () => {
      jest
        .spyOn(repositoryMock, 'find')
        .mockRejectedValue(new Error('find error'));
      await expect(service.findAll()).rejects.toThrowError('find error');
    });
  });

  describe('User Creating', () => {
    it('creates the user', async () => {
      const createduser: User = { ...newUser };
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(createduser);
      const result: User = await service.create(newUser);
      expect(result).toEqual(createduser);
    });
    it('error in save', async () => {
      jest
        .spyOn(repositoryMock, 'save')
        .mockRejectedValue(new Error('save error'));
      await expect(service.create(newUser)).rejects.toThrowError('save error');
    });
  });

  describe('User Updating', () => {
    it('updates the user', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(user2);
      jest
        .spyOn(repositoryMock, 'update')
        .mockResolvedValue({ affected: 1, raw: null, generatedMaps: null });
      const result: UpdateResult = await service.update(
        updateuser.email,
        updateuser,
      );
      expect(result.affected).toEqual(1);
    });
    it('no user with given email to update', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      await expect(
        service.update(updateuser.email, updateuser),
      ).rejects.toThrowError(USER_NOT_FOUND_MESSAGE);
    });
    it('error in update', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(updateuser);
      jest
        .spyOn(repositoryMock, 'update')
        .mockRejectedValue(new Error('update error'));
      await expect(
        service.update(updateuser.email, updateuser),
      ).rejects.toThrowError('update error');
    });
  });

  describe('User Removing', () => {
    it('removes the user', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(removeuser);
      jest.spyOn(repositoryMock, 'remove').mockResolvedValue(removeuser);
      const result: User = await service.remove(removeuser.email);
      expect(result).toEqual(removeuser);
    });
    it('no user with given email to remove', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      await expect(service.remove(removeuser.email)).rejects.toThrowError(
        USER_NOT_FOUND_MESSAGE,
      );
    });
    it('error in remove', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(removeuser);
      jest
        .spyOn(repositoryMock, 'remove')
        .mockRejectedValue(new Error('remove error'));
      await expect(service.remove(removeuser.email)).rejects.toThrowError(
        'remove error',
      );
    });
  });
});
