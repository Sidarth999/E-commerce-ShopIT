import React, { useEffect, useMemo } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { DataGrid } from "@mui/x-data-grid";

const MyOrders = () => {
	const { data, isLoading, error } = useMyOrdersQuery();

	const [searchParams] = useSearchParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const orderSuccess = searchParams.get("order_success");

	useEffect(() => {
		if (error) {
			toast.error(error?.data?.message);
		}

		if (orderSuccess) {
			dispatch(clearCart());
			navigate("/me/orders");
		}
	}, [error, orderSuccess]);

	const columns = useMemo(
		() => [
			{
				field: "id",
				headerName: "ID",
				sortable: true,
				flex: 3,
			},
			{
				field: "amount",
				headerName: "Amount",
				sortable: true,
				flex: 2,
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
						<Link to={`/me/order/${params.row.id}`} className="btn btn-primary">
							<i className="fa fa-eye"></i>
						</Link>

						<Link
							to={`/invoice/order/${params.row.id}`}
							className="btn btn-success ms-2">
							<i className="fa fa-print"></i>
						</Link>
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
				amount: `$${order?.totalAmount}`,
				paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
				orderStatus: order?.orderStatus,
			})) || []
		);
	}, [data]);

	if (isLoading) return <Loader />;
	return (
		<>
			<MetaData title={"My Orders"} />
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
		</>
	);
};

export default MyOrders;
