// src/services/user/user.controller.js
import userService from './user.service.js';   // ← use import, not require

export default {
  async getAll(req, res) {
    try {
      const users = await userService.getAll();
      return res.json({ success: true, users });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  async getall(req, res) {
    try {
      const users = await userService.getAll(); 
        return res.json({ success: true, users });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }},

  async updateById(req, res) {
    try {
      const updated = await userService.updateById(req.params.id, req.body);
      return res.json({ success: true, user: updated });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(req.user.id, currentPassword, newPassword);
      return res.json({ success: true, message: 'Password updated' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const deleted = await userService.deleteUser(req.user, req.params.id);
      return res.json({ success: true, deleted });
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }
  },

  async updateRole(req, res) {
    try {
      const updated = await userService.updateRole(req.user, req.params.id, req.body.role);
      return res.json({ success: true, user: updated });
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }
  }
};