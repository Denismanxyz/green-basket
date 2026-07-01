const applyQueryFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');

const factory = (Model, options = {}) => ({
  getAll: asyncHandler(async (req, res) => {
    const filter = {};
    if (options.storeScoped && req.user.role === 'manager' && req.user.store) {
      filter.store = req.user.store;
    }

    const countQuery = Model.countDocuments(filter);
    const { query, page, limit } = applyQueryFeatures(
      Model.find(filter),
      req.query,
      options.searchable || []
    );
    if (options.populate) query.populate(options.populate);
    const [items, total] = await Promise.all([query, countQuery]);
    res.json({ data: items, page, pages: Math.ceil(total / limit), total });
  }),

  getOne: asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (options.populate) query = query.populate(options.populate);
    const item = await query;
    if (!item) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json(item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json(item);
  }),

  remove: asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json({ message: `${Model.modelName} deleted` });
  })
});

module.exports = factory;
