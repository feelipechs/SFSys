import db from '../models/index.js';
const { User } = db;

class UserService {
  async findAll(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'password'],
    });

    return users;
  }

  async findById(id) {
    const user = await User.findByPk();
  }

  async create(req, res) {}

  async update(req, res) {}

  async delete(req, res) {}
}

export default new UserService();
