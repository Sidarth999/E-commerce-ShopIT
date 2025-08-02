import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import {
	useDeleteOrderMutation,
	useGetAdminOrdersQuery,
} from "../../redux/api/orderApi";
import { DataGrid } from "@mui/x-data-grid";

const ListOrders = () => {
	const { data, isLoading, error } = useGetAdminOrdersQuery();

	const [
		deleteOrder,
		{ error: deleteError, isLoading: isDeleteLoading, isSuccess },
	] = useDeleteOrderMutation();

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

	const deleteOrderHandler = (id) => {
		deleteOrder(id);
	};

	const columns = useMemo(
		() => [
			{
				field: "id",
				headerName: "ID",
				sortable: true,
				flex: 3,
			},
			{
				field: "paymentStatus",
				headerName: "Payment Status",
				sortable: true,
				flex: 2,
			},
			{
				field: "orderStatus",
				headerName: "Order Status",
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
						<Link
							to={`/admin/orders/${params.row.id}`}
							className="btn btn-outline-primary">
							<i className="fa fa-pencil" />
						</Link>

						<button
							className="btn btn-outline-danger ms-2"
							onClick={() => deleteOrderHandler(params.row.id)}
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
			data?.orders?.map((order) => ({
				id: order?._id,
				paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
				orderStatus: order?.orderStatus,
			})) || []
		);
	}, [data]);

	if (isLoading) return <Loader />;
	return (
		<AdminLayout>
			<MetaData title={"All Orders"} />
			<div>
				<h1 className="my-5">{data?.orders?.length} Orders</h1>

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

export default ListOrders;
