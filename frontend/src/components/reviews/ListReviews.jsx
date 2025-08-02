import Rating from "@mui/material/Rating";
import React from "react";

const ListReviews = ({ reviews }) => {
	return (
		<>
			<div className="reviews w-75">
				<h3>Other's Reviews:</h3>
				<hr />

				{reviews?.map((review) => (
					<div key={review._id} className="review-card my-3">
						<div className="row">
							<div className="col-1">
								<img
									src={
										review?.user?.avatar
											? review?.user?.avatar?.url
											: "/images/default_avatar.jpg"
									}
									alt={review?.user?.name}
									width="50"
									height="50"
									className="rounded-circle"
								/>
							</div>
							<div className="col-11">
								<Rating
									name="half-rating-read"
									value={review?.rating || 0}
									precision={0.5}
									sx={{ fontSize: "24px" }}
									readOnly
								/>
								<p className="review_user">by {review?.user?.name}</p>
								<p className="review_comment">{review?.comment}</p>
							</div>
						</div>
						<hr />
					</div>
				))}
			</div>
		</>
	);
};

export default ListReviews;
