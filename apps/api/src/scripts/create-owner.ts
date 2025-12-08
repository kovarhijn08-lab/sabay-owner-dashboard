import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/database/entities/user.entity';

async function createOwner() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: './data/database.sqlite',
    entities: [User],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const existingOwner = await userRepository.findOne({ where: { login: 'investor1' } });
  if (existingOwner) {
    console.log('✅ Пользователь investor1 уже существует');
    console.log(`   Текущая роль: ${existingOwner.role}`);
    
    // Обновляем роль на owner, если она еще investor (для старых данных)
    const currentRole = existingOwner.role as string;
    if (currentRole === 'investor') {
      existingOwner.role = 'owner' as any;
      await userRepository.save(existingOwner);
      console.log('✅ Роль обновлена на "owner"');
    } else if (currentRole !== 'owner') {
      existingOwner.role = 'owner' as any;
      await userRepository.save(existingOwner);
      console.log('✅ Роль обновлена на "owner"');
    }
    
    await dataSource.destroy();
    return;
  }

  // Создаем нового владельца
  const passwordHash = await bcrypt.hash('investor123', 10);
  const owner = userRepository.create({
    login: 'investor1',
    passwordHash,
    role: 'owner',
    name: 'Тестовый владелец',
    email: 'investor@example.com',
    isActive: true,
  });

  await userRepository.save(owner);
  console.log('✅ Пользователь investor1 создан');
  console.log('   Логин: investor1');
  console.log('   Пароль: investor123');
  console.log('   Роль: owner');

  await dataSource.destroy();
}

createOwner().catch(console.error);

