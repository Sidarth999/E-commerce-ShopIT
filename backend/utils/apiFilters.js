class APIFilter {
	constructor(query, queryStr) {
		this.query = query;
		this.queryStr = queryStr;
	}

	search() {
		const keyword = this.queryStr.keyword
			? {
					name: {
						$regex: this.queryStr.keyword,
						$options: "i",
					},
			  }
			: {};

		this.query = this.query.find({ ...keyword });
		return this;
	}

	filters() {
		const queryCopy = { ...this.queryStr };

		// Fields to remove
		const fieldsToRemove = ["keyword", "page"];
		fieldsToRemove.forEach((el) => delete queryCopy[el]);

		// Advance filter for price, ratings etc
		// let queryStr = JSON.stringify(queryCopy);
		// queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

		// Build MongoDB filter object manually to replace above 2 lines
		const mongoQuery = {};
		for (let key in queryCopy) {
			const value = queryCopy[key];

			// Detect operators like price[gte]
			const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
			if (match) {
				const field = match[1]; // e.g., 'price'
				const operator = `$${match[2]}`; // e.g., '$gte'

				if (!mongoQuery[field]) mongoQuery[field] = {};
				mongoQuery[field][operator] = value;
			} else {
				// Direct field like category=electronics
				mongoQuery[key] = value;
			}
		}

		this.query = this.query.find(mongoQuery);
		return this;
	}

	pagination(resPerPage) {
		const currentPage = Number(this.queryStr.page) || 1;
		const skip = resPerPage * (currentPage - 1);

		this.query = this.query.limit(resPerPage).skip(skip);
		return this;
	}
}

export default APIFilter;
