import { User } from "../models";
import { getSHA256 } from "../_utils";
import * as jwt from "jsonwebtoken";
import { SECRET } from "../_utils";

type UserData = { email: string; fullname: string; password: string };

export class UserController {
  async createUser(data: UserData) {
    const { email, fullname, password } = data;
    const user = await User.create({
      fullname,
      email,
      password: getSHA256(password),
    });
    return user;
  }
  async getMe(userId) {
    const user = await User.findByPk(userId);
    if (user) {
      return { fullname: user.get("fullname"), email: user.get("email") };
    } else {
      return { message: "not found" };
    }
  }
  async getToken(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await User.findOne({
      where: { email, password: getSHA256(password) },
    });

    if (user) {
      const token = jwt.sign({ id: user.get("id") }, SECRET);
      return { token };
    } else {
      return { error: "email or password incorrect" };
    }
  }
  async findByEmail(email: string) {
    const user = await User.findOne({ where: { email } });
    return user ? true : false;
  }
  async findById(userId) {
    const user = await User.findByPk(userId);
    return user;
  }
  async updateUser(userId, data) {
    const { fullname, password } = data;
    if (fullname && password) {
      await User.update(
        { fullname, password: getSHA256(password) },
        { where: { id: userId } }
      );
    } else if (fullname) {
      await User.update({ fullname }, { where: { id: userId } });
    } else if (password) {
      await User.update(
        { password: getSHA256(password) },
        { where: { id: userId } }
      );
    }
    return true;
  }
}
