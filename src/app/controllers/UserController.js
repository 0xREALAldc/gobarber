import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // aqui vai validar os dados que foram informados no body, se batem com o schema declarado acima
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const { id, name, email, provider } = await User.create(req.body); // usar os dados que vem na requisicao para criar o user

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // a diferenca aqui na edicao e que nome e email nao sao obrigatorios mais e na `password` temos uma condicao que so vai tornar a `password` obrigatoria quando a
    // `old_password` tiver sido informada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      old_password: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('old_password', (old_password, field) =>
          old_password ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        // aqui ele vai obrigar o confirmPassword se o password for informado e com o `.oneOf ele
        // valida se o campo possui o valor igual o do que esta no array, informado por referencia utilizando o `Yup.ref` que seria o `password`
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // aqui vai validar os dados que foram informados no body, se batem com o schema declarado acima
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, old_password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // so verifica se ele informou a senha, as vezes pode estar mudando o nome apenas
    if (old_password && !(await user.chechPassword(old_password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
