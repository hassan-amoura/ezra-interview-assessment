import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
export const USER = process.env.MEMBER_USER_ONE || 'hassan.amoura+test@gmail.com';
export const PWD = process.env.MEMBER_PWD_ONE || 'Tester1!';
