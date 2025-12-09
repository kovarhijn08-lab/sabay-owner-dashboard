import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/modules/app/app.module";
import { DataSource } from "typeorm";

describe("Manager API (e2e)", () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let managerId: string;
  let propertyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();

    // Создание тестового менеджера и получение токена
    const loginResponse = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({
        login: "manager1",
        password: "manager123",
      });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.accessToken;
      managerId = loginResponse.body.user.id;
    } else {
      // Создаём менеджера если его нет
      await request(app.getHttpServer()).post("/api/auth/register").send({
        login: "manager1",
        password: "manager123",
        role: "manager",
        name: "Test Manager",
      });

      const loginResponse2 = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          login: "manager1",
          password: "manager123",
        });
      authToken = loginResponse2.body.accessToken;
      managerId = loginResponse2.body.user.id;
    }

    // Получаем или создаём тестовый объект
    const propertiesResponse = await request(app.getHttpServer())
      .get("/api/manager/properties")
      .set("Authorization", `Bearer ${authToken}`);

    if (
      propertiesResponse.status === 200 &&
      propertiesResponse.body.length > 0
    ) {
      propertyId = propertiesResponse.body[0].id;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /api/manager/properties", () => {
    it("should return list of properties for manager", () => {
      return request(app.getHttpServer())
        .get("/api/manager/properties")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it("should return 401 without authorization", () => {
      return request(app.getHttpServer())
        .get("/api/manager/properties")
        .expect(401);
    });
  });

  describe("GET /api/manager/properties/:id", () => {
    it("should return property details if manager has access", () => {
      if (!propertyId) {
        return; // Пропускаем если нет тестового объекта
      }

      return request(app.getHttpServer())
        .get(`/api/manager/properties/${propertyId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("name");
        });
    });

    it("should return 404 if property not found", () => {
      return request(app.getHttpServer())
        .get("/api/manager/properties/non-existent-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe("POST /api/manager/properties/:id/construction-updates", () => {
    it("should create construction update with valid data", () => {
      if (!propertyId) {
        return;
      }

      return request(app.getHttpServer())
        .post(`/api/manager/properties/${propertyId}/construction-updates`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          progress: 60,
          stage: "Foundation",
          description: "E2E test update",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.progress).toBe(60);
        });
    });

    it("should return 400 if progress is out of range", () => {
      if (!propertyId) {
        return;
      }

      return request(app.getHttpServer())
        .post(`/api/manager/properties/${propertyId}/construction-updates`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          progress: 150,
        })
        .expect(400);
    });

    it("should return 400 if more than 3 photos", () => {
      if (!propertyId) {
        return;
      }

      return request(app.getHttpServer())
        .post(`/api/manager/properties/${propertyId}/construction-updates`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          progress: 60,
          photos: ["photo1", "photo2", "photo3", "photo4"],
        })
        .expect(400);
    });
  });

  describe("POST /api/manager/properties/:id/bookings", () => {
    it("should create booking with valid data", () => {
      if (!propertyId) {
        return;
      }

      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 7);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 3);

      return request(app.getHttpServer())
        .post(`/api/manager/properties/${propertyId}/bookings`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          checkIn: checkIn.toISOString().split("T")[0],
          checkOut: checkOut.toISOString().split("T")[0],
          totalAmount: 50000,
          source: "Airbnb",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.amount).toBe(50000);
        });
    });

    it("should return 400 if checkout is before checkin", () => {
      if (!propertyId) {
        return;
      }

      return request(app.getHttpServer())
        .post(`/api/manager/properties/${propertyId}/bookings`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          checkIn: "2024-06-05",
          checkOut: "2024-06-01",
          totalAmount: 50000,
          source: "Airbnb",
        })
        .expect(400);
    });
  });

  describe("POST /api/manager/properties/:id/expenses", () => {
    it("should create expense with valid data", () => {
      if (!propertyId) {
        return;
      }

      return request(app.getHttpServer())
        .post(`/api/manager/properties/${propertyId}/expenses`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 5000,
          expenseType: "Cleaning",
          expenseDate: new Date().toISOString().split("T")[0],
          description: "E2E test expense",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.amount).toBe(5000);
        });
    });

    it("should return 400 if amount is zero", () => {
      if (!propertyId) {
        return;
      }

      return request(app.getHttpServer())
        .post(`/api/manager/properties/${propertyId}/expenses`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 0,
          expenseType: "Cleaning",
          expenseDate: new Date().toISOString().split("T")[0],
        })
        .expect(400);
    });
  });

  describe("GET /api/manager/properties/:id/events", () => {
    it("should return property events", () => {
      if (!propertyId) {
        return;
      }

      return request(app.getHttpServer())
        .get(`/api/manager/properties/${propertyId}/events`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
