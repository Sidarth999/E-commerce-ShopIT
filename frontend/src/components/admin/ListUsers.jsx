import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import {
	useDeleteUserMutation,
	useGetAdminUsersQuery,
} from "../../redux/api/userApi";
import { DataGrid } from "@mui/x-data-grid";

const ListUsers = () => {
	const { data, isLoading, error } = useGetAdminUsersQuery();
	const [
		deleteUser,
		{ error: deleteError, isLoading: isDeleteLoading, isSuccess },
	] = useDeleteUserMutation();

	useEffect(() => {
		if (error) {
			toast.error(error?.data?.message);
		}

		if (deleteError) {
			toast.error(deleteError?.data?.message);
		}

		if (isSuccess) {
			toast.success("User Deleted");
		}
	}, [error, deleteError, isSuccess]);

	const deleteUserHandler = (id) => {
		deleteUser(id);
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
				flex: 3,
			},
			{
				field: "email",
				headerName: "Email",
				sortable: true,
				flex: 3,
			},
			{
				field: "role",
				headerName: "Role",
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
							to={`/admin/users/${params.row.id}`}
							className="btn btn-outline-primary">
							<i className="fa fa-pencil" />
						</Link>
						<button
							className="btn btn-outline-danger ms-2"
							onClick={() => deleteUserHandler(params.row.id)}
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
			data?.users?.map((user) => ({
				id: user?._id,
				name: user?.name,
				email: user?.email,
				role: user?.role,
			})) || []
		);
	}, [data]);

	if (isLoading) return <Loader />;
	return (
		<AdminLayout>
			<MetaData title={"All Users"} />
			<div>
				<h1 className="my-5">{data?.users?.length} Users</h1>
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

export default ListUsers;
