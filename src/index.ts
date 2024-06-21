import path from "path";
import express from "express";
const app = express();

app.use("/assets", express.static(path.resolve("build/dist/assets")));

app.get("/*", (_, res) => {
    if (process.env.NODE_ENV === "production") {
        return res.sendFile(path.resolve("build/dist/index.html"));
    }
    res.sendFile(path.resolve("src/html/not-production.html"));
});

app.listen(3000, () => console.log("Server is running on http://localhost:3000"));
