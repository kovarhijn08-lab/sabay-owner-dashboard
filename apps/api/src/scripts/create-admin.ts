import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/database/entities/user.entity';

async function createAdmin() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: './data/database.sqlite',
    entities: [User],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({ where: { login: 'admin' } });
  if (existingAdmin) {
    console.log('✅ Пользователь admin уже существует');
    await dataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = userRepository.create({
    login: 'admin',
    passwordHash,
    role: 'admin',
    name: 'Администратор',
    isActive: true,
  });

  await userRepository.save(admin);
  console.log('✅ Пользователь admin создан');
  console.log('   Логин: admin');
  console.log('   Пароль: admin123');

  await dataSource.destroy();
}

createAdmin().catch(console.error);
