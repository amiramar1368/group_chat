import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";

import path from "path";

import { User } from "../db/models/user.js";
import { UserGroup } from "../db/models/user-group.js";
import { userValidator } from "../utils/validator.js";
import { Group } from "../db/models/group.js";

const { ACCESS_TOKEN_KEY } = process.env;

export class UserController {
  static async signInPage(req, res) {
    res.render("sign-in");
  }

  static async signUp(req, res) {
    try {
      const { fullname, username, password } = req.body;
      await userValidator.validate({ fullname, username, password });
      if (!req.file) {
        return res.sendFailure(400, "Upload A Picture");
      }
      if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
        return res.sendFailure(400, "Only JPEG and PNG files are allowed!");
      }
      
      let imageName = `${Date.now()}_${req.file.originalname}`;
      await sharp(req.file.buffer)
        .resize(500)
        .jpeg({ quality: 60 })
        .toFile(path.resolve("public", "images", imageName));

      const user = await User.findOne({ where: { username } });
      if (user) {
        return res.sendFailure(409, "this username already exists in database");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        fullname,
        username,
        password: hashedPassword,
        imageName,
      });
      return res.sendSuccess(201, "New User Add Successfully", { user: newUser });
    } catch (err) {
      if (err.errors) {
        return res.sendError(400, err.errors[0]);
      }
      res.sendError();
    }
  }
  static async signIn(req, res) {
    const { username, password } = req.body;
    try {
      if (username == undefined || username === "" || password == undefined || password === "") {
        return res.sendError(400, "username and password are required");
      }

      const user = await User.findOne({ where: { username }, include: { model: UserGroup, include: Group } });
      if (!user) {
        return res.sendError(404, "User Not Found");
      }
      const passwordIsMatch = await bcrypt.compare(password, user.password);
      if (!passwordIsMatch) {
        return res.sendError(404, "username or password is wrong");
      }
      const groups = UserController.getUserGroups(user);
      const userInfo = { id: user.id, fullname: user.fullname, image: user.imageName, groups };
      const token = jwt.sign(userInfo, ACCESS_TOKEN_KEY);
      res.cookie("token", token, { httpOnly: true });
      req.user = {
        userInfo,
        token,
      };
      return res.sendSuccess(200, "signin Successfully", { user: userInfo });
    } catch (err) {
      console.log(err);
      res.sendError();
    }
  }

  static getUserGroups(user) {
    const groups = [];
    for (let i = 0; i < user.user_groups.length; i++) {
      groups.push({ id: user.user_groups[i].group.id, name: user.user_groups[i].group.name });
    }
    return groups;
  }

  static async addUserToGroup(req, res) {
    try {
      const { groupId, userId } = req.body;
      await UserGroup.create({ groupId, userId });
      res.status(201).json({ success: true, body: null, message: "Add succesfully" });
    } catch (err) {
      if (err?.message === "Validation error") {
        return res.sendError(409, "already added");
      }
      return res.sendError();
    }
  }
}
