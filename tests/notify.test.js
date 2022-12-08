const request = require("supertest");
const app = require("../app");
const setupTestDB = require("./utils/setupTestDB");
const Notifies = require("../models/notifyModel");

var token = token;

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

describe("notify routes", () => {
    let notify;
    beforeEach(async () => {
        notify = await Notifies.findOne().sort({ createdAt: -1 }).limit(1);
    });

    let newNotify;
    beforeEach(() => {
        newNotify = {
            // id: expect.anything(),
            recipients: "6372434a2a8dbdbcb39a1171",
            url: "/profile/6372483561414d3b24913658",
            text: "has started to follow you.dsds",
            content: "has started to follow you. dsdsd",
            image: "/profile/637248356141",
            user: "637243bb2a8dbdbcb39a1199",
            _id: "6372483b61414d3b24913667",
        };
    });
    test("POST /api/notify", async () => {
        const res = await request(app)
            .post("/api/notify")
            .set("Authorization", token)
            .send(newNotify);
        expect(res.status).toBe(200);
    })

    describe("DELETE /api/notify/:id", () => {
        test("Return status 200 if data is ok", async () => {
            await request(app)
                .delete(`/api/notify/${notify._id}`)
                .set("Authorization", token)
                .expect(200);
        });
    })

    describe("GET /api/notifies", () => {
		let recipients;
		beforeEach(() => {
			recipients = "63839f3e0ca6c9bc4b6ca339";
		});
		test("Return status 200 and data", async () => {
			const res = await request(app)
				.get("/api/notifies")
				.set("Authorization", token);
			const dbNotifies = await Notifies.find({ recipients });
			expect(res.status).toBe(200);
			expect(res.body.notifies.recipients).toBe(dbNotifies.recipients);
		});

		test("Return status 400 if header has no authorization or wrong authorization", async () => {
			await request(app).get("/api/notifies").expect(400);
		});
	});

    describe("PATCH /api/isReadNotify/:id", () => {
		test("Return status 200 if data is ok", async () => {
			await request(app)
				.patch(`/api/isReadNotify/${notify._id}`)
				.set("Authorization", token)
				.send({
					content: "test change notify",
				})
				.expect(200);
		});

		test("Return status 500 if _id is not valid", async () => {
			let invalidId = "invalidId";
			await request(app)
				.patch(`/api/isReadNotify/${invalidId}`)
				.set("Authorization", token)
				.send({
					content: "test change isReadNotify",
				})
				.expect(500);
		});

		test("Return status 400 if header has no authorization or wrong authorization", async () => {
			await request(app)
				.patch(`/api/isReadNotify/${notify._id}`)
				.send({
					content: "test change isReadNotify",
				})
				.expect(400);
		});
	});

    describe("DELETE /api/deleteAllNotify", () => {
        test("Return status 200 if data is ok", async () => {
            await request(app)
                .delete('/api/deleteAllNotify')
                .set("Authorization", token)
                .expect(200);

            const dbNotify = await Notifies.findById(notify.recipients);
            expect(dbNotify).toBeNull();
        });
    })


});