import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
export const connectDB = (url) => {
    mongoose.connect(url, {
        dbName: "E-Comm",
    })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = ({ product, order, admin, userId, orderId, productIds }) => {
    if (product) {
        const productKey = [
            "latest-product",
            "categories",
            "all-products",
            `product-${productIds}`
        ];
        productIds?.forEach((i) => productKey.push(`product-${i}`));
        myCache.del(productKey);
    }
    if (order) {
        const ordersKeys = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
        myCache.del(ordersKeys);
    }
    if (admin) {
        myCache.del(["admin-stats", "admin-pie-charts", "admin-bar-charts", "admin-line-charts"]);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, productsCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};
