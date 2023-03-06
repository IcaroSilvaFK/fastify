import fastify from 'fastify';
import { z } from 'zod';
import { hash } from 'argon2';
import { randomUUID } from 'crypto';
import cors from '@fastify/cors';

const schema = z.object({
  amountPasswords: z.number().optional(),
  password: z.string().optional(),
});

async function main() {
  try {
    const app = fastify({ logger: true });

    await app.register(cors);

    app.post('/api/hash_generator', async (ctx, reply) => {
      const { amountPasswords, password } = schema.parse(ctx.body);

      if (password) {
        const randomPassword = randomUUID();
        const hasWithRandomPassword = hash(randomPassword);

        reply.status(200).send({
          responses: hasWithRandomPassword,
        });
        return;
      }

      if (amountPasswords) {
        const passwords: string[] = [];
        for (let index = 0; index > amountPasswords; index++) {
          const randomPassword = randomUUID();
          const encryptedPassword = await hash(randomPassword);

          passwords.push(encryptedPassword);
        }

        reply.code(200).send({ passwords });
      }
    });

    app.listen();
  } catch (err) {
    console.log(err);
  }
}

main();
