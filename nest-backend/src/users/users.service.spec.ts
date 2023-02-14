import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
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
let users: User[];
const user1 = {
  email: 'jesse1@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};
const user2 = {
  email: 'jesse2@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};
users = [user1, user2];
const updateuser = {
  email: 'jesse@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wellhjgjs',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
};
const removeuser = {
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
          })),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });
  describe('a Getting', () => {
    it('get all the a', async () => {
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

  describe('a Creating', () => {
    it('creates the a', async () => {
      const createduser = { ...newUser };
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(createduser);
      const result = await service.create(newUser);
      expect(result).toEqual(createduser);
    });
    it('error in save', async () => {
      jest
        .spyOn(repositoryMock, 'save')
        .mockRejectedValue(new Error('save error'));
      await expect(service.create(newUser)).rejects.toThrowError('save error');
    });
  });

  describe('a Updating', () => {
    it('updates the a', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(user2);
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(updateuser);
      const result = await service.update(updateuser.email, updateuser);
      expect(result).toEqual(updateuser);
    });
    it('no a with given email to update', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      await expect(
        service.update(updateuser.email, updateuser),
      ).rejects.toThrowError('There is no existing User for this id');
    });
    it('error in save', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(updateuser);
      jest
        .spyOn(repositoryMock, 'save')
        .mockRejectedValue(new Error('save error'));
      await expect(
        service.update(updateuser.email, updateuser),
      ).rejects.toThrowError('save error');
    });
  });

  describe('a Removing', () => {
    it('removes the a', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(removeuser);
      jest.spyOn(repositoryMock, 'remove').mockResolvedValue(removeuser);
      const result = await service.remove(removeuser.email);
      expect(result).toEqual(removeuser);
    });
    it('no a with given email to remove', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      await expect(service.remove(removeuser.email)).rejects.toThrowError(
        'There is no existing User for this id',
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
