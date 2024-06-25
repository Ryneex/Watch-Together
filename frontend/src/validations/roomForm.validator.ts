import { z } from "zod";
import { nameValidator } from "./name.validator";

export const roomFormValidator = z.object({ name: nameValidator, password: nameValidator });
