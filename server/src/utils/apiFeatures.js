const applyQueryFeatures = (query, queryParams, searchable = []) => {
  const page = Math.max(Number(queryParams.page) || 1, 1);
  const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sort = queryParams.sort || '-createdAt';

  if (queryParams.search && searchable.length) {
    const regex = new RegExp(queryParams.search, 'i');
    query = query.find({ $or: searchable.map((field) => ({ [field]: regex })) });
  }

  return { query: query.sort(sort).skip(skip).limit(limit), page, limit };
};

module.exports = applyQueryFeatures;
