import crypto from 'crypto';
import sequelize from './db/db.js';
import User from './models/user.model.js';
import { execSync } from 'child_process';
import sha256 from 'js-sha256';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { exec } from 'child_process';

class UserService {
  static key = UserService.genKey();
  static jwtKey = UserService.genKey();

  constructor() { }

  static genKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  static genIv(username) {
    const rest = 16 - username.length;
    if (username.length >= 16) {
      return Buffer.alloc(16, username.slice(0, 16));
    } else {
      return Buffer.alloc(16, username + '0'.repeat(rest));
    }
  }

  getCipherPassword(username, password) {
    if (UserService.key === undefined) UserService.key = UserService.genKey();
    const iv = UserService.genIv(username).toString('hex');
    const hashedPassword = sha256(`MB{${password}}`);
    const command = `echo -n "${hashedPassword}" | openssl enc -aes-256-cbc -e -K ${UserService.key} -iv ${iv.toString('hex')} -base64`;
    const cipherPassword = execSync(command, { encoding: 'utf8' }).toString().trim();

    return cipherPassword;
  }

  async register(username, password) {
    const registered = {
      status: false,
      jwt: null,
    };

    try {
      const cipherPassword = this.getCipherPassword(username, password);
      const status = await User.create({
        username: username,
        password: cipherPassword,
      });
      if (status !== null) {
        registered.status = true;
        registered.jwt = this.genJwt(status);
      }
    } catch (error) {
      console.error('Error register:', error);
    }

    return registered;
  }

  async login(username, password) {
    const log = {
      status: false,
      jwt: ''
    };

    try {
      const cipherPassword = this.getCipherPassword(username, password);

      const user = await User.findOne({
        where: {
          username: username,
          password: cipherPassword,
        },
      });
      if (user !== null) {
        log.status = true;
        log.jwt = this.genJwt(user);
      }
    } catch (error) {
      console.error('Error Login:', error);
    }

    return log;
  }

  genJwt(user) {
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, UserService.jwtKey);
    return token;
  }

  async generate(files_dir, filename, file) {
    const gen = {
      status: false,
      message: 'Error',
    }

    try {
      console.log('files_dir:', files_dir);
      console.log('filename:', filename);
      console.log('file:', file);
      this.checkNumberFiles(files_dir);
      const command = `/bin/bash -c 'echo "Traitement" && mv ${file.path} ${files_dir}/${filename}.png'`;
      const execStatus = execSync(command, { encoding: 'utf8' }).toString().trim();
      if (execStatus === 'Traitement') {
        gen.status = true;
        gen.message = 'Success';
      } else {
        gen.message = 'Error during saving file : ' + command;
      }
      return gen;
    } catch (error) {
      console.error('Error generate:', error.message);
      gen.message = error.message;
      return gen;
    }
  }

  checkNumberFiles(files_dir) {
    try {
      const files = fs.readdirSync(files_dir).map((file) => {
        const stats = fs.statSync(`${files_dir}/${file}`);
        return {
          name: file,
          size: stats.size,
          mtime: stats.mtime,
        };
      });
  
      if (files.length > 5) {
        files.sort((a, b) => a.mtime - b.mtime);
        const fileToDelete = files.slice(0, files.length - 5);
        fileToDelete.forEach((file) =>
          fs.unlinkSync(`${files_dir}/${file.name}`)
        );
      }
    } catch (error) {
      console.error('Error checkNumberFiles:', error);
    }
  }

  getPictures(files_dir) {
    const final = [];
    const files =  fs.readdirSync(files_dir).filter((file) => file.endsWith('.png'));
    files.forEach((file, index) => {
      const src = file;
      final.push({ src: src, name: file.replace('.png', '') });
    });
    return final;
  }
}

export default UserService;