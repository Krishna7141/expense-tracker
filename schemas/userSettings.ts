// import { Currencies } from "@/lib/currencies";
// import {z} from "zod";

// export const UpdateUserCurrencySchema = z.object({
//     currency: z.custom(val => {
//         const isFound = Currencies.some(c => c.value===val);
//         if(!isFound) {
//             throw new Error(`Invalid Currency: ${val}`);
//         }
//         return val;
//     })
// })