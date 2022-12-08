const request = require("supertest");
const app = require("../app");
const setupTestDB = require("./utils/setupTestDB");
const Posts = require("../models/postModel");
const Users = require('../models/userModel')

var token;

setupTestDB();

describe("login", () => {
	test("Return status 200 and data if email and password correct", async () => {
		const res = await request(app).post("/api/login").send({
			email: "thanhsang6325@gmail.com",
			password: "123456",
		});

		expect(res.status).toBe(200);
		token = res.body.access_token;
	});
});
