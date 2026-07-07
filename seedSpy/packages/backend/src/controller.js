import express from 'express';
import UserService from './service.js';
import multer from 'multer';
import jwt from 'jsonwebtoken';

const userService = new UserService();
const router = express.Router();
const upload = multer({ dest: 'files/', limits: { fileSize: 100000000 } });

const toClean = [
  '&&', ';', '/', '\\', 'nc -c',
  '/dev/udp', '/bin/sh', 'sh', '/bin'
]

const verifyUserJwt = (req, res, next) => {
  let status = false;
  try {
    const authorization = req.headers.authorization;
    if (authorization !== undefined) {
      const token = authorization.split(' ')[1];
      jwt.verify(token, UserService.jwtKey, (err, decoded) => {
        if (!err) {
          req.user = decoded;
          status = true;
        }
      });
    }
    if (status) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error verifyUserJwt:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

function cleanFilename(filename) {
  toClean.forEach((clean) => {
    filename = filename.replace(clean, '');
  });
  return filename;
}

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SeedSpy',
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const login = await userService.login(username, password);
  res.status((login.status ? 200 : 400)).json({
    status: (login.status) ? 'success' : 'fail',
    jwt: (login.status) ? login.jwt : null,
  });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const registered = await userService.register(username, password);
  res.json({
    status: (registered.status) ? true : false,
    jwt: (registered.status) ? registered.jwt : null,
  });
});

router.post("/avatar/save", upload.single('file'), verifyUserJwt, async (req, res) => {
  const files_dir = process.cwd() + '/files';
  const filename = cleanFilename(req.body.filename);
  const file = req.file;
  const generation = await userService.generate(files_dir, filename, file);

  const status = (generation.status) ? 200 : 400;
  res.status(status).json(generation);
});

router.get('/pictures', verifyUserJwt, (req, res) => {
  const files_dir = process.cwd() + '/files';
  const pictures = userService.getPictures(files_dir);
  res.json({
    status: true,
    pictures: pictures,
    count: pictures.length,
  });
});

export default router;