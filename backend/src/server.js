import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";



dotenv.config();

const app = express()
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//middleware
if(process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
    }));
}

app.use(express.json()); //middleware that will parse JSON bodies: req.body
app.use(rateLimiter);



// app.use((req, res, next) => {
//     console.log('Req method is ${req.method} & Req URL is ${req.url}');
//     next();
// }); // simple custom middleware

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname,"../frontend","dist", "index.html"));
    });

}

connectDB().then( () => {

    app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT); 
    });
});

// mongodb+srv://nikztenorio06:7soCoepT26GBxWXe@cluster0.i00rw8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0