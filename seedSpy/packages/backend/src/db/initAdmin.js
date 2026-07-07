import { execSync } from "child_process";
import User from "../models/user.model.js";
import UserService from "../service.js";
import crypto from 'crypto';
import fs from 'fs/promises';
import sha256 from 'js-sha256';

function encryptPassword(username, password) {
  if (UserService.key === undefined) {
    UserService.key = UserService.genKey();
  }
  const iv = UserService.genIv(username);
  const command = `echo -n "${password}" | openssl enc -aes-256-cbc -e -K ${UserService.key} -iv ${iv.toString('hex')} -base64`;
  const cipherPassword = execSync(command, { encoding: 'utf8' }).toString().trim();
  return cipherPassword;
}

const initAdmin = async () => {
  const admin = await User.findOne({
    where: {
      username: 'admin'
    }
  });

  if (admin === null) {
    try {
      const filePath = 'init.txt';
      const adminPassword = (await fs.readFile(filePath)).toString().trim();
      const adminHash = sha256(`MB{${adminPassword}}`);
      const cipherPassword = encryptPassword('admin', adminHash);
      await User.create({
        username: 'admin',
        password: cipherPassword
      });

      await fs.writeFile(filePath, Buffer.alloc(100, 0));
      await fs.unlink(filePath);
    } catch (error) {
      console.error(error);
    }
  }
}

export { initAdmin, encryptPassword };