import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import {
	useDeleteReviewMutation,
	useLazyGetProductReviewsQuery,
} from "../../redux/api/productsApi";
import { DataGrid } from "@mui/x-data-grid";
import MetaData from "../layout/MetaData";

const ProductReviews = () => {
	const [productId, setProductId] = useState("");
	const [getProductReviews, { data, isLoading, error }] =
		useLazyGetProductReviewsQuery();

	const [
		deleteReview,
		{ isLoading: isDeleteLoading, error: deleteError, isSuccess },
	] = useDeleteReviewMutation();

	useEffect(() => {
		if (error) {
			toast.error(error?.data?.message);
		}

		if (deleteError) {
			toast.error(deleteError?.data?.message);
		}

		if (isSuccess) {
			toast.success("Review Deleted");
		}
	}, [error, deleteError, isSuccess]);

	const submitHandler = (e) => {
		e.preventDefault();

		getProductReviews(productId);
	};

	const deleteReviewHandler = (id) => {
		deleteReview({ productId, id });
	};

	const columns = useMemo(
		() => [
			{
				field: "id",
				headerName: "Review ID",
				sortable: true,
				flex: 2,
			},
			{
				field: "rating",
				headerName: "Rating",
				sortable: true,
				flex: 1,
			},
			{
				field: "comment",
				headerName: "Comment",
				sortable: true,
				flex: 2,
			},
			{
				field: "user",
				headerName: "User",
				sortable: true,
				flex: 2,
			},
			{
				field: "actions",
				headerName: "Action",
				flex: 2,
				sortable: false,
				renderCell: (params) => (
					<>
						<button
							className="btn btn-outline-danger ms-2"
							onClick={() => deleteReviewHandler(params.row.id)}
							disabled={isDeleteLoading}>
							<i className="fa fa-trash"></i>
						</button>
					</>
				),
			},
		],
		[data]
	);

	const rows = useMemo(() => {
		return (
			data?.reviews?.map((review) => ({
				id: review?._id,
				rating: review?.rating,
				comment: review?.comment,
				user: review?.user?.name,
			})) || []
		);
	}, [data]);

	if (isLoading) return <Loader />;

	return (
		<AdminLayout>
			<MetaData title={"Review"} />
			<div className="row justify-content-center my-5">
				<div className="col-6">
					<form onSubmit={submitHandler}>
						<div className="mb-3">
							<label htmlFor="productId_field" className="form-label">
								Enter Product ID
							</label>
							<input
								type="text"
								id="productId_field"
								className="form-control"
								value={productId}
								onChange={(e) => setProductId(e.target.value)}
							/>
						</div>

						<button
							id="search_button"
							type="submit"
							className="btn btn-primary w-100 py-2">
							SEARCH
						</button>
					</form>
				</div>
			</div>

			{data?.reviews?.length > 0 ? (
				<DataGrid
					className="striped-data-grid px-3"
					rows={rows}
					columns={columns}
					sortingOrder={["asc", "desc"]}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
					pageSizeOptions={[5]}
					disableRowSelectionOnClick
				/>
			) : (
				<p className="mt-5 text-center">No Reviews</p>
			)}
		</AdminLayout>
	);
};

export default ProductReviews;
