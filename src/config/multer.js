import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path'; // extname: retorna a extensao do arquivo e resolve: a que ja usamos para pegar o caminho

export default {
  // como o multer ira guardar os nossos arquivos, EG: usando um CDN (content delivery network) que sao servidores online de arquivos fisicos tipo amazon S3/digital Ocean spaces. Mas aqui vamos salvar em disco na pasta 'temp'
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // como sera formatado o nome do arquivo de imagem
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
