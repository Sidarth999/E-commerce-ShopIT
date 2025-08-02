import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import {
	useDeleteProductMutation,
	useGetAdminProductsQuery,
} from "../../redux/api/productsApi";
import AdminLayout from "../layout/AdminLayout";
import { DataGrid } from "@mui/x-data-grid";

const ListProducts = () => {
	const { data, isLoading, error } = useGetAdminProductsQuery();
	const [
		deleteProduct,
		{ isLoading: isDeleteLoading, error: deleteError, isSuccess },
	] = useDeleteProductMutation();

	useEffect(() => {
		if (error) {
			toast.error(error?.data?.message);
		}

		if (deleteError) {
			toast.error(deleteError?.data?.message);
		}

		if (isSuccess) {
			toast.success("Product Deleted");
		}
	}, [error, deleteError, isSuccess]);

	const deleteProductHandler = (id) => {
		deleteProduct(id);
	};

	const columns = useMemo(
		() => [
			{
				field: "id",
				headerName: "ID",
				sortable: true,
				flex: 2,
			},
			{
				field: "name",
				headerName: "Name",
				sortable: true,
				flex: 2,
			},
			{
				field: "stock",
				headerName: "Stock",
				sortable: true,
				flex: 1,
			},
			{
				field: "actions",
				headerName: "Action",
				flex: 2,
				sortable: false,
				renderCell: (params) => (
					<>
						<Link
							to={`/admin/products/${params.row.id}`}
							className="btn btn-outline-primary">
							<i className="fa fa-pencil" />
						</Link>

						<Link
							to={`/admin/products/${params.row.id}/upload_images`}
							className="btn btn-outline-success ms-2">
							<i className="fa fa-image"></i>
						</Link>

						<button
							className="btn btn-outline-danger ms-2"
							onClick={() => deleteProductHandler(params.row.id)}
							disabled={isDeleteLoading}>
							<i className="fa fa-trash" />
						</button>
					</>
				),
			},
		],
		[]
	);

	const rows = useMemo(() => {
		return (
			data?.products?.map((product) => ({
				id: product?._id,
				name: `${product?.name?.substring(0, 30)}...`,
				stock: product?.stock,
			})) || []
		);
	}, [data]);

	if (isLoading) return <Loader />;
	return (
		<AdminLayout>
			<MetaData title={"All Products"} />
			<div>
				<h1 className="my-5">{data?.products?.length} Products</h1>

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
			</div>
		</AdminLayout>
	);
};

export default ListProducts;
