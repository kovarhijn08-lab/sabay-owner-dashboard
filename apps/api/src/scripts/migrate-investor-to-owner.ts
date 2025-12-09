import { DataSource } from "typeorm";
import * as path from "path";
import { User } from "../modules/database/entities/user.entity";

/**
 * Миграционный скрипт для обновления роли 'investor' на 'owner'
 *
 * Выполняет:
 * - Находит всех пользователей с ролью 'investor'
 * - Обновляет их роль на 'owner'
 * - Логирует количество обновленных записей
 */

async function migrateInvestorToOwner() {
  console.log("🚀 Начинаем миграцию ролей investor → owner...\n");

  // Инициализация DataSource
  const dataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "../../../../data/database.sqlite"),
    entities: [User],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log("✅ Подключение к базе данных установлено\n");

    const userRepository = dataSource.getRepository(User);

    // Находим всех пользователей с ролью 'investor' (используем any для старых данных)
    const investors = await userRepository.find({
      where: { role: "investor" as any },
    });

    console.log(
      `📊 Найдено пользователей с ролью 'investor': ${investors.length}`,
    );

    if (investors.length === 0) {
      console.log("✅ Нет пользователей для миграции\n");
      await dataSource.destroy();
      return;
    }

    // Обновляем роль на 'owner'
    const updateResult = await userRepository.update(
      { role: "investor" as any },
      { role: "owner" },
    );

    console.log(`✅ Обновлено пользователей: ${updateResult.affected || 0}\n`);

    // Проверяем результат
    const remainingInvestors = await userRepository.find({
      where: { role: "investor" as any },
    });

    if (remainingInvestors.length === 0) {
      console.log(
        '✅ Миграция завершена успешно! Все пользователи с ролью "investor" обновлены на "owner"\n',
      );
    } else {
      console.log(
        `⚠️  Внимание: осталось ${remainingInvestors.length} пользователей с ролью "investor"\n`,
      );
    }

    await dataSource.destroy();
    console.log("✅ Соединение с базой данных закрыто\n");
  } catch (error) {
    console.error("❌ Ошибка при миграции:", error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

// Запуск миграции
if (require.main === module) {
  migrateInvestorToOwner()
    .then(() => {
      console.log("🎉 Миграция завершена");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Критическая ошибка:", error);
      process.exit(1);
    });
}

export { migrateInvestorToOwner };
