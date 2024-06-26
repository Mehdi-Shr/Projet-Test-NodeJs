const productModel = require("../models/product");
const { api } = require("../models/index");
const MockAdapter = require("axios-mock-adapter");

describe("Product Model", () => {
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

    const testData = { id: 1, marque: "Test Product" };
    const collectionName = "products";

    test("should get product by id", async () => {
        mock.onGet(`/${collectionName}/1`).reply(200, testData);

        const data = await productModel.get(1);
        expect(data).toEqual(testData);
    });

    test("should get all products", async () => {
        mock.onGet(`/${collectionName}`).reply(200, [testData]);

        const data = await productModel.getAll();
        expect(data).toEqual([testData]);
    });

    test("should create a product", async () => {
        const newProduct = { marque: "New Product" };
        const createdProduct = { id: 2, ...newProduct };
        mock.onPost(`/${collectionName}`).reply(201, createdProduct);

        const data = await productModel.create(newProduct);
        expect(data).toEqual(createdProduct);
    });

    test("should update a product", async () => {
        const updatedData = { marque: "Updated Test Product" };
        const updatedProduct = { ...testData, ...updatedData };
        mock.onPatch(`/${collectionName}/1`).reply(200, updatedProduct);

        const data = await productModel.update(1, updatedData);
        expect(data).toEqual(updatedProduct);
    });

    test("should delete a product", async () => {
        mock.onDelete(`/${collectionName}/1`).reply(200, testData);

        const data = await productModel.delete(1);
        expect(data).toEqual(testData);
    });

    // Additional edge case tests

    test("should handle error when getting product by id", async () => {
        mock.onGet(`/${collectionName}/1`).reply(404);

        await expect(productModel.get(1)).rejects.toThrow();
    });

    test("should handle error when creating a product", async () => {
        const newProduct = { marque: "New Product" };
        mock.onPost(`/${collectionName}`).reply(400);

        await expect(productModel.create(newProduct)).rejects.toThrow();
    });

    test("should handle error when updating a product", async () => {
        const updatedData = { marque: "Updated Test Product" };
        mock.onPatch(`/${collectionName}/1`).reply(400);

        await expect(productModel.update(1, updatedData)).rejects.toThrow();
    });

    test("should handle error when deleting a product", async () => {
        mock.onDelete(`/${collectionName}/1`).reply(400);

        await expect(productModel.delete(1)).rejects.toThrow();
    });
});
