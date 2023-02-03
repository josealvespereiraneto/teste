import "express-async-errors";
import express, { json, NextFunction, Request, Response } from "express"
import { router } from "./routes"
import cors from 'cors';

const app = express()

app.use(json())
app.use(cors(
  //origin:Questao de acesso passa a url
))

app.use(router);
//middleware
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  return response.json({
    status: "Error",
    message: error.message,
  })
})

app.listen(3000, () => console.log("Server is running on port 3000"))