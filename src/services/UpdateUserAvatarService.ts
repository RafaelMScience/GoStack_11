import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';

import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRespository = getRepository(User);

    const user = await usersRespository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated user can changed avatar.');
    }

    if (user.avatar) {
      // Deletar o avatar anterios

      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersRespository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
