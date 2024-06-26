const userModel = require("../models/user");
const { api } = require("../models/index");
const MockAdapter = require("axios-mock-adapter");

describe("User Model", () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    const testUser = { id: 1, email: "test@example.com", password: "password" };
    const collectionName = "users";

    test("should get user by id", async () => {
        mock.onGet(`/${collectionName}/1`).reply(200, testUser);

        const data = await userModel.get(1);
        expect(data).toEqual(testUser);
    });

    test("should get all users", async () => {
        mock.onGet(`/${collectionName}`).reply(200, [testUser]);

        const data = await userModel.getAll();
        expect(data).toEqual([testUser]);
    });

    test("should create a user", async () => {
        const newUser = { email: "new@example.com", password: "newpassword" };
        const createdUser = { id: 2, ...newUser };
        mock.onPost(`/${collectionName}`).reply(201, createdUser);

        const data = await userModel.create(newUser);
        expect(data).toEqual(createdUser);
    });

    test("should update a user", async () => {
        const updatedData = { email: "updated@example.com" };
        const updatedUser = { ...testUser, ...updatedData };
        mock.onPatch(`/${collectionName}/1`).reply(200, updatedUser);

        const data = await userModel.update(1, updatedData);
        expect(data).toEqual(updatedUser);
    });

    test("should delete a user", async () => {
        mock.onDelete(`/${collectionName}/1`).reply(200, testUser);

        const data = await userModel.delete(1);
        expect(data).toEqual(testUser);
    });

    test("should get user by email and password", async () => {
        mock.onGet(`/${collectionName}?q=${JSON.stringify({ email: testUser.email, password: testUser.password })}`).reply(200, [testUser]);

        const data = await userModel.getByEmailAndPassword(testUser.email, testUser.password);
        expect(data).toEqual(testUser);
    });

    // Additional edge case tests

    test("should handle error when getting user by id", async () => {
        mock.onGet(`/${collectionName}/1`).reply(404);

        await expect(userModel.get(1)).rejects.toThrow();
    });

    test("should handle error when creating a user", async () => {
        const newUser = { email: "new@example.com", password: "newpassword" };
        mock.onPost(`/${collectionName}`).reply(400);

        await expect(userModel.create(newUser)).rejects.toThrow();
    });

    test("should handle error when updating a user", async () => {
        const updatedData = { email: "updated@example.com" };
        mock.onPatch(`/${collectionName}/1`).reply(400);

        await expect(userModel.update(1, updatedData)).rejects.toThrow();
    });

    test("should handle error when deleting a user", async () => {
        mock.onDelete(`/${collectionName}/1`).reply(400);

        await expect(userModel.delete(1)).rejects.toThrow();
    });

    test("should handle error when getting user by email and password", async () => {
        mock.onGet(`/${collectionName}?q=${JSON.stringify({ email: testUser.email, password: testUser.password })}`).reply(404);

        await expect(userModel.getByEmailAndPassword(testUser.email, testUser.password)).rejects.toThrow();
    });
});
