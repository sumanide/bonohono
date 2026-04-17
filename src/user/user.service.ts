import { prismaService } from "../db/MariaDB";

export const userService = {
  // wait until payload come
  // async me() {
  //   const result = await prismaService.
  // }
  async getAllUser() {
    const result = await prismaService.$queryRaw`select * from users limit 5`;
    return result;
  },
  async getUserById(id: string) {
    const result =
      await prismaService.$queryRaw`select * from users where id = ${id}`;
    return result;
  },
};
