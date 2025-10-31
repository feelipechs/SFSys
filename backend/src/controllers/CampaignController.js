import CampaignService from '../services/CampaignService';

class CampaignController {
  // POST /api/campaign
  static async create(req, res) {
    try {
      const newCampaign = await CampaignService.create(req.body);
      return res.status(201).json(newCampaign);
    } catch (error) {
      console.error('Erro ao criar campanha:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/campaign
  static async findAll(req, res) {
    try {
      const campaigns = await CampaignService.findAll();
    } catch (error) {}
  }

  static async findById(req, res) {}

  static async update(req, res) {}

  static async destroy(req, res) {}
}

export default CampaignController;
