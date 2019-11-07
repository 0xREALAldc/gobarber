import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // transforma uma funcao com callback para uma em que podemos usar o async/await

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // authorization e o nome que ele envia por padrao

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // usando a desestruturacao assim, com uma ` , ` virgula no 1 parametro, ignoramos o mesmo e conseguimos pegar o valor do segundo apenas

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret); // ele vai retornar o token decifrado, se ele nao conseguir vai cair no catch abaixo

    req.userId = decoded.id; // aqui adiciona o id do usuario logado a requisicao

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
