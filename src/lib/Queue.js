import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Quere {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    // o `init()` vai inicializar todas as filas
    // ao utilizar o '({ key, handle })' estamos desestruturando a classe para pegar os eventos
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          // armazenamos a conexao com o redis
          redis: redisConfig,
        }),
        handle, // metodo que vai receber as infos e processar o job
      };
    });
  }

  // aqui vamos utilizar para adicionar os `novos jobs` dentro de cada fila
  // `queue` e o nome da fila, significa o mesmo que o `key` acima
  // `job`vai conter os dados pro job, no caso do cancellation os dados do `appointment`
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // aqui vamos processar as filas
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // aqui o 'job.queue.name' tem o mesmo valor do `key` acima
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Quere();
