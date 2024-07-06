const request = require("supertest");
const app = require("../../index");
const { User, Organisation, sequelize
  
 } = require("../models");


beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await User.destroy({ where: {} });
  await Organisation.destroy({ where: {} });
});

describe("Auth API", () => {
  describe("Register User", () => {
    it("Should register user successfully with default organisation", async () => {
      const response = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data.user).toMatchObject({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      });

      const user = await User.findOne({
        where: { email: "john.doe@example.com" },
      });
      const organisation = await Organisation.findOne({
        where: { name: "John's Organisation" },
      });
      expect(user).not.toBeNull();
      expect(organisation).not.toBeNull();
    });

    it("Should fail if required fields are missing", async () => {
      const response = await request(app).post("/auth/register").send({
        firstName: "John",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(422);
      expect(response.body.status).toBe("error");
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe("lastName");
    });

    it("Should fail if there’s duplicate email", async () => {
      await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      const response = await request(app).post("/auth/register").send({
        firstName: "Jane",
        lastName: "Smith",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Email already exists");
    });
  });

  describe("Login User", () => {
    beforeEach(async () => {
      await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });
    });

    it("Should log the user in successfully", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data.user).toMatchObject({
        email: "john.doe@example.com",
      });
    });

    it("Should fail to log in with invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Invalid email or password");
    });
  });
});
